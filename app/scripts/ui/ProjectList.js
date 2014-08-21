/** @jsx React.DOM */

'use strict';

var React = require('react');

var ProjectItem = require('./ProjectItem');

var ProjectList = React.createClass({
    renderProject: function(project) {
        return (
            /* jshint trailing:false, quotmark:false, newcap:false */
            <li key={[project.author.name, project.title].join('/')}>
                <ProjectItem project={project} />
            </li>
        );
    },
    render: function() {
        return (
            /* jshint trailing:false, quotmark:false, newcap:false */
            <ul className="project-list">
                {
                    this.props.projects.map(this.renderProject)
                }
            </ul>
        );
    }
});

module.exports = ProjectList;
