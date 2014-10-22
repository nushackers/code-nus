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
            maxProjects: 5,
            tag: null
        };
    },
    showMore: function() {
        if (this.state.maxProjects < this.props.popularProjects.length) {
            this.setState({
                maxProjects: this.state.maxProjects + 5
            });
        }
    },
    renderTag: function(tag) {
        var isCurrent = tag == this.state.tag;
        if (tag == 'all') {
            isCurrent = !this.state.tag;
        }
        return (
            <li>
                <button type="button" className={"btn btn-sm" + (isCurrent ? " btn-success" : "")} onClick={this.doFilter(tag)}>
                    {tag}
                </button>
            </li>
        )
    },
    doFilter: function(tag) {
        return function() {
            this.setState({
                tag: tag === 'all' ? null : tag,
                maxProjects: 5
            });
        }.bind(this);
    },
    render: function() {
        var featuredProject = this.props.featuredProject;
        var tag = this.state.tag;
        function filterTag(project) {
            return !!project.tags[tag];
        }

        var popularProjects = this.props.popularProjects,
            recentProjects = this.props.recentProjects;

        if (tag) {
            popularProjects = popularProjects.filter(filterTag);
            recentProjects = recentProjects.filter(filterTag);
        }
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
                    <div className="col-md-12">
                        <ul className="list-inline tags-list">
                            { this.renderTag('all') }
                            {
                                this.props.allTags.map(this.renderTag)
                            }
                        </ul>
                    </div>
                </div>
                { popularProjects.length > 5 ?
                    <div className="row">
                        <div className="col-md-6">
                            <header>
                                <h2>Popular</h2>
                            </header>
                            <ProjectList projects={popularProjects.slice(0, this.state.maxProjects)} />
                        </div>
                        <div className="col-md-6">
                            <header>
                                <h2>Recently updated</h2>
                            </header>
                            <ProjectList projects={recentProjects.slice(0, this.state.maxProjects)} />
                        </div>
                    </div> :
                    <div className="row">
                        <div className="col-md-12">
                            <ProjectList projects={popularProjects.slice(0, this.state.maxProjects)} />
                        </div>
                    </div>
                }
            </div>
        );
    }
});

module.exports = ProjectBrowser;
