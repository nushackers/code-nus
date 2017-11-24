'use strict';

var gulp = require('gulp'),
    markdown = require('gulp-markdown'),
    through = require('through2'),
    swig = require('swig'),
    path = require('path'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    fs = require('fs'),
    childProcess = require('child_process'),
    toc = require('gulp-toc'),
    axios = require('axios');

// Load plugins
var $ = require('gulp-load-plugins')();

function applyTemplate(templateFile) {
    return through.obj(function (file, enc, cb) {
        var tpl = swig.compileFile(path.join(__dirname, templateFile), {autoescape: false, cache: false});
        var filename = path.basename(file.path);
        var script = filename.split(".")[0];

        var data = {
            content: file.contents.toString(),
            script: script
        };
        file.contents = new Buffer(tpl(data), 'utf8');
        this.push(file);
        cb();
    });
}

function generateFeaturedPage() {
    return through.obj(function(file, enc, cb) {
        var tpl = swig.compileFile(path.join(__dirname, 'app/templates/featured.html'), {autoescape: false, cache: false});
        var featured = childProcess.fork(file.path);
        featured.on('message', function(msg) {
            if (msg.success) {
                var content = msg.data;
                var data = {
                    content: content
                };
                file.contents = new Buffer(tpl(data), 'utf8');
                file.path = file.path.split('.js').join('.html');
                this.push(file);
                cb();
            } else {
                console.log(msg.error);
                cb();
            }
        }.bind(this));
    });
}

function prettifyPath() {
    return through.obj(function (file, enc, cb) {
        var p = file.path;
        var filename = path.basename(p);
        var dirname = path.dirname(p);

        file.path = path.join(dirname, filename.split('.')[0], 'index.html');
        this.push(file);
        cb();
    });
}


// Styles
gulp.task('styles', function () {
    return gulp.src('app/styles/main.scss')
        .pipe(sass({
            includePaths: ['node_modules/'],
            outputStyle: 'compressed',
        }).on('error', sass.logError))
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('dist/styles'))
        .pipe($.size())
        .pipe($.connect.reload());
});

// JSONs
gulp.task('json', function () {
    return gulp.src('app/scripts/data.json')
                .pipe(gulp.dest('dist/scripts'));
});

gulp.task('fetch', function () {
    return axios({
        method:'get',
        url: 'https://raw.githubusercontent.com/nushackers/code-nus-repos/master/repos.json',
        responseType:'stream'
    }).then(function (response) {
        response.data.pipe(fs.createWriteStream('app/scripts/data.json'));
    });
})

// Scripts
gulp.task('scripts', function () {
    return gulp.src(['app/scripts/index.js'])
        .pipe($.browserify({
            insertGlobals: true,
            transform: ['reactify']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'))
        .pipe($.size())
        .pipe($.connect.reload());
    });


// Markdown
gulp.task('md-page', function () {
    return gulp.src('app/pages/*.md')
        .pipe(markdown())
        .pipe(toc())
        .pipe(applyTemplate('app/templates/page.html'))
        .pipe(prettifyPath())
        .pipe(gulp.dest('dist/'));
});

// featured
gulp.task('featured-projects', function() {
    return gulp.src(['./featured.js'])
        .pipe(generateFeaturedPage())
        .pipe(gulp.dest('dist'))
        .pipe($.connect.reload());
});

// HTML
gulp.task('html', function () {
    return gulp.src('app/index.html')
        .pipe(applyTemplate('app/templates/dynamic.html'))
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size())
        .pipe($.connect.reload());
});

// Images
gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size())
        .pipe($.connect.reload());
});

gulp.task('compress', function() {
  gulp.src('./dist/scripts/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist/scripts'));
});

// Clean
gulp.task('clean', function () {
    return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], {read: false}).pipe($.clean());
});


// Bundle
gulp.task('bundle', ['styles', 'json', 'scripts', 'bower'], function(){
    return gulp.src('./app/index.html')
               .pipe(applyTemplate('app/templates/dynamic.html'))
               .pipe($.useref.assets())
               .pipe($.useref.restore())
               .pipe($.useref())
               .pipe(gulp.dest('dist'));
});

// Build
gulp.task('build', ['html', 'bundle', 'images', 'md-page', 'featured-projects'], function() {
    gulp.start('compress');
});

// Default task
gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

// Connect
gulp.task('connect', $.connect.server({
    root: ['dist'],
    port: 9000,
    livereload: true
}));

// Bower helper
gulp.task('bower', function() {
    gulp.src('app/bower_components/**/*.js', {base: 'app/bower_components'})
        .pipe(gulp.dest('dist/bower_components/'));
});

// Watch
gulp.task('watch', ['html', 'images', 'md-page', 'featured-projects', 'bundle', 'connect'], function () {

    // Watch .html files
    gulp.watch('app/*.html', ['html']);

    // Watch .md files
    gulp.watch('app/pages/*.md', ['md-page']);

    // Watch .scss files
    gulp.watch('app/styles/**/*.scss', ['styles']);

    // Watch templates
    gulp.watch('app/templates/*.html', ['md-page', 'html', 'featured-projects']);

    // Watch .js files
    gulp.watch('app/scripts/**/*.js', ['scripts', 'featured-projects']);
    gulp.watch('./featured.js', ['featured-projects']);

    // Watch .json files
    gulp.watch('app/scripts/data.json', ['json', 'featured-projects']);
    gulp.watch('app/scripts/featured_projects.json', ['json', 'featured-projects']);

    // Watch image files
    gulp.watch('app/images/**/*', ['images']);
});
