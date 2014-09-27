/** @jsx React.DOM */

'use strict';

var React = require('react'),
    ProjectList = require('./ui/ProjectList'),
    ProjectItem = require('./ui/ProjectItem'),
    featuredProjectInfo = require('./featured_project'),
    lunr = require('lunr'),
    $ = require('jquery');

// from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\#&]" + name + "=([^&#]*)"),
        results = regex.exec(location.hash);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var popularProjects,
    projects,
    recentProjects,
    featuredProject;

var idx = lunr(function () {
    this.field('title', { boost: 10 });
    this.field('description');
});

function scoring(s1, s2) {
    return s1 * s2 / (s1 + s2);
}

function updateDisplay() {
    /* jshint trailing:false, quotmark:false, newcap:false */
    var searchTerm = getParameterByName('search');
    console.log(searchTerm);
    $('input').val(searchTerm);
    var results = [];
    if (searchTerm) {
        results = idx.search(searchTerm).sort(function(a, b) {
            return scoring(b.score, projects[b.ref].stars) - scoring(a.score, projects[a.ref].stars);
        }).map(function(result) {
            return projects[result.ref];
        });
        React.renderComponent(
            results.length ? <ProjectList projects={results} /> : <div className="alert alert-warning" role="alert">No results found.</div>,
            document.querySelector(".project-list-container")
        );
    } else {
        React.renderComponent(
            <div>
                <div className="featured">
                    <header>
                        <h2>Featured</h2>
                    </header>
                    <ProjectItem project={featuredProject} />
                    <article className="project-post" dangerouslySetInnerHTML={{__html: featuredProjectInfo.description}} />
                    <p className="promo">
                        Want to get your project featured? <a href="http://nushackers.org/contact">Contact us!</a>
                    </p>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <header>
                            <h2>Popular</h2>
                        </header>
                        <ProjectList projects={popularProjects} />
                    </div>
                    <div className="col-md-6">
                        <header>
                            <h2>Recently updated</h2>
                        </header>
                        <ProjectList projects={recentProjects} />
                    </div>
                </div>
            </div>,
            document.querySelector(".project-list-container")
        );
    }
}

var readyd = $.Deferred();

$(document).ready(function() {
    'use strict';
    readyd.resolve();
});

$.when($.get('/scripts/data.json'), readyd.promise()).done(function(res){
    var data = res[0];
    popularProjects = data.popular_projects;
    recentProjects = data.recent_projects;
    projects = data.projects;

    projects.forEach(function(p, ind) {
        p.id = ind;
        p.last_commit_date = new Date(p.last_commit_date);
        idx.add(p);

        if (p.repository.href === featuredProjectInfo.url) {
            featuredProject = p;
        }
    });

    $('input').on('input', function(evt) {
        var searchTerm = evt.target.value;
        location.hash = "search=" + searchTerm;
    });

    $(window).on('hashchange', updateDisplay);
    updateDisplay()
});

