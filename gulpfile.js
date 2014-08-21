'use strict';

var gulp = require('gulp'),
    markdown = require('gulp-markdown'),
    through = require('through2'),
    swig = require('swig'),
    path = require('path'),
    uglify = require('gulp-uglify');

// Load plugins
var $ = require('gulp-load-plugins')();

function applyTemplate(templateFile) {
    return through.obj(function (file, enc, cb) {            
        var tpl = swig.compileFile(path.join(__dirname, templateFile), {autoescape: false, cache: false});

        var data = {
            content: file.contents.toString()
        };            
        file.contents = new Buffer(tpl(data), 'utf8');
        this.push(file);
        cb();
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
        .pipe($.rubySass({
            style: 'expanded',
            precision: 10,
            loadPath: ['app/bower_components']
        }))
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



// Scripts
gulp.task('scripts', function () {
    return gulp.src('app/scripts/app.js')
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
        .pipe(applyTemplate('app/templates/page.html'))
        .pipe(prettifyPath())
        .pipe(gulp.dest('dist/'));
});

// HTML
gulp.task('html', function () {
    return gulp.src('app/*.html')
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
    return gulp.src('./app/*.html')
               .pipe(applyTemplate('app/templates/dynamic.html'))
               .pipe($.useref.assets())
               .pipe($.useref.restore())
               .pipe($.useref())
               .pipe(gulp.dest('dist'));
});

// Build
gulp.task('build', ['html', 'bundle', 'images', 'md-page'], function() {
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
gulp.task('watch', ['html', 'images', 'md-page', 'bundle', 'connect'], function () {

    // Watch .html files
    gulp.watch('app/*.html', ['html']);

    // Watch .md files
    gulp.watch('app/pages/*.md', ['md-page']);
    
    // Watch .scss files
    gulp.watch('app/styles/**/*.scss', ['styles']);
    
    // Watch templates
    gulp.watch('app/templates/*.html', ['md-page', 'html']);

    // Watch .js files
    gulp.watch('app/scripts/**/*.js', ['scripts']);

    // Watch .json files
    gulp.watch('app/scripts/data.json', ['json']);

    // Watch image files
    gulp.watch('app/images/**/*', ['images']);
});
