/** @jsx React.DOM */

'use strict';

var React = require('react');

var ProjectItem = require('./ProjectItem');

var ProjectBrowser = React.createClass({
    render: function() {
        var featuredProjects = this.props.featuredProjectInfo.projects;
        var featuredProjectPairs = [];
        if (featuredProjects.length > 1) {
            featuredProjects.forEach(function(p, ind) {
                if (!(ind % 2)) {
                    featuredProjectPairs.push([p])
                } else {
                    featuredProjectPairs[Math.floor(ind / 2)].push(p)
                }
            })
        }
        return (
            /* jshint trailing:false, quotmark:false, newcap:false */
            <div>
                {featuredProjects.length > 1 ?
                    featuredProjectPairs.map(function(ps, ind) {
                        return (<div className="row">
                            {ps.map(function(p) {
                                return (<div className="col-md-6"><ProjectItem project={p} hideImage={true} /></div>)
                            })}
                        </div>)
                    }) : <ProjectItem project={featuredProjects[0]} hideImage={true} /> }
                <article className="project-post">
                    <img className="featured-image" src={featuredProjects[0].image} />
                    <div dangerouslySetInnerHTML={{__html: this.props.featuredProjectInfo.description}} />
                </article>
            </div>
        );
    }
});

module.exports = ProjectBrowser;
