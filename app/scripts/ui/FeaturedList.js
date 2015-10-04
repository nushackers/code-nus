/** @jsx React.DOM */

'use strict';

var React = require('react');

var FeaturedItem = require('./FeaturedItem');

var ProjectBrowser = React.createClass({
    renderProject: function(featuredProjectInfo) {
        return (
            /* jshint trailing:false, quotmark:false, newcap:false */
            <li className="featured">
                <FeaturedItem featuredProjectInfo={featuredProjectInfo} />
            </li>
        );
    },
    render: function() {
        var featuredProjectsInfo = this.props.featuredProjectsInfo;
        var projects = this.props.projects;
        var map = {};
        projects.forEach(function(p) {
            map[p.repository.href] = p;
        });
        featuredProjectsInfo.forEach(function(info) {
            info.projects = info.urls.map(function(url) {
                return map[url];
            });
        });
        return (
            /* jshint trailing:false, quotmark:false, newcap:false */
            <ul className="featured-list">
                {
                    featuredProjectsInfo.map(this.renderProject)
                }
            </ul>
        );
    }
});

module.exports = ProjectBrowser;
