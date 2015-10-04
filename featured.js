/** @jsx React.DOM */

'use strict';
require('node-jsx').install()

var fs = require('fs');

try {
    var React = require('react'),
        ProjectList = require('./app/scripts/ui/ProjectList'),
        ProjectItem = require('./app/scripts/ui/ProjectItem'),
        data = JSON.parse(fs.readFileSync(__dirname + '/app/scripts/data.json')),
        ProjectBrowser = require('./app/scripts/ui/ProjectBrowser'),
        featuredProjectsInfo = JSON.parse(fs.readFileSync(__dirname + '/app/scripts/featured_projects.json').toString().split("\\\n").join("")),
        lunr = require('lunr'),
        FeaturedList = require('./app/scripts/ui/FeaturedList'),
        $ = require('jquery');

    var projects = data.projects;
    var featuredProjects = [];

    process.send({
        success: true,
        data: React.renderToStaticMarkup(React.createElement(FeaturedList, {
            projects: data.projects,
            featuredProjectsInfo: featuredProjectsInfo
        }))
    });
} catch(e) {
    process.send({
        success: false,
        error: e.stack
    });
}

process.exit();