/** @jsx React.DOM */

'use strict';

var React = require('react');

var ProjectItem = require('./ProjectItem'),
    ProjectList = require('./ProjectList');

var ProjectBrowser = React.createClass({
    renderProject: function(project) {
        return (
            /* jshint trailing:false, quotmark:false, newcap:false */
            <li key={[project.author.name, project.title].join('/')}>
                <ProjectItem project={project} />
            </li>
        );
    },
    getInitialState: function() {
        return {
            maxProjects: 5
        };
    },
    showMore: function() {
        if (this.state.maxProjects < this.props.popularProjects.length) {
            this.setState({
                maxProjects: this.state.maxProjects + 5
            });
        }
    },
    render: function() {
        var featuredProject = this.props.featuredProject;
        return (
            /* jshint trailing:false, quotmark:false, newcap:false */
            <div>
                <div className="featured">
                    <header>
                        <h2>Featured</h2>
                    </header>
                    <ProjectItem project={featuredProject} />
                    <article className="project-post" dangerouslySetInnerHTML={{__html: this.props.featuredProjectInfo.description}} />
                    <p className="promo">
                        Want to get your project featured? <a href="http://nushackers.org/contact">Contact us!</a>
                    </p>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <header>
                            <h2>Popular</h2>
                        </header>
                        <ProjectList projects={this.props.popularProjects.slice(0, this.state.maxProjects)} />
                    </div>
                    <div className="col-md-6">
                        <header>
                            <h2>Recently updated</h2>
                        </header>
                        <ProjectList projects={this.props.recentProjects.slice(0, this.state.maxProjects)} />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = ProjectBrowser;
