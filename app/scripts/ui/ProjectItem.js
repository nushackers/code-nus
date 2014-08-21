/** @jsx React.DOM */

'use strict';

var React = require('react');

var ProjectItem = React.createClass({
    render: function() {
        var project = this.props.project;
        return (
            /* jshint trailing:false, quotmark:false, newcap:false */
            <div className="project">
                <header>
                    <div className="title">
                        {project.title}
                    </div>
                    <div className="author">
                        <a href={project.author.href}>{project.author.name}</a>
                    </div>
                </header>
                <div className="body">
                    <div className="description">
                        {project.description}
                    </div>
                </div>
                <div className="links">
                    <a href={project.repository.href}>Repository</a>
                    { project.release || project.homepage ?
                        <a href={(project.release && project.release.href) || project.homepage}>Link</a>
                        : []
                    }
                </div>
                <div className="stats">
                    <div className="stars">
                        {project.stars}
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = ProjectItem;
