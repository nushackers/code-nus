/** @jsx React.DOM */

'use strict';

var React = require('react');

var ProjectItem = require('./ProjectItem'),
    ProjectList = require('./ProjectList'),
    FeaturedItem = require('./FeaturedItem');

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
            maxProjects: 5,
            isPopular: false
        };
    },
    showMore: function() {
        this.setState({
            maxProjects: Math.min(this.state.maxProjects + 5, this.props.popularProjects.length)
        });
    },
    renderTag: function(tag) {
        var isCurrent = tag == this.props.tag;
        if (tag == 'all' && !isCurrent) {
            isCurrent = !this.props.tag;
        }
        return (
            <li>
                <button type="button" className={"btn btn-sm" + (isCurrent ? " btn-success" : "")} onClick={this.doFilter(tag)}>
                    {tag}
                </button>
            </li>
        )
    },
    toPopluar: function() {
        this.setState({
            isPopular: true
        });
    },
    toRecent: function() {
        this.setState({
            isPopular: false
        });
    },
    doFilter: function(tag) {
        return function() {
            location.hash = "tag=" + tag;
        }.bind(this);
    },
    renderTagChooser: function() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <ul className="list-inline tags-list">
                        { this.renderTag('all') }
                        {
                            this.props.allTags.map(this.renderTag)
                        }
                    </ul>
                </div>
            </div>
        )
    },
    render: function() {
        var tag = this.props.tag;
        function filterTag(project) {
            return !!project.tags[tag];
        }

        var displayProjects = this.state.isPopular ? this.props.popularProjects : this.props.recentProjects;

        if (tag && tag != 'all') {
            displayProjects = displayProjects.filter(filterTag);
        }
        return (
            /* jshint trailing:false, quotmark:false, newcap:false */
            <div>
                <div className="featured">
                    <FeaturedItem featuredProjectInfo={this.props.featuredProjectInfo} />
                    <div><a href="./featured.html">More...</a></div>
                    <p className="promo">
                        Want to get your project featured? <a href="http://nushackers.org/contact">Contact us!</a>
                    </p>
                </div>
                { this.renderTagChooser() }
                <div className="row">
                    <div className="col-md-12 sort-switch-outer">
                        <div className="btn-group sort-switch">
                          <button type="button" className={"btn btn-default" + (this.state.isPopular ? " active" : "")} onClick={this.toPopluar}>Popular</button>
                          <button type="button" className={"btn btn-default" + (this.state.isPopular ? "" : " active")} onClick={this.toRecent}>Recently updated</button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <ProjectList projects={displayProjects.slice(0, this.state.maxProjects)} />
                    </div>
                </div>
                { displayProjects.length > 6 ? this.renderTagChooser() : [] }
            </div>
        );
    }
});

module.exports = ProjectBrowser;
