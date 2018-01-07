import { h, Component } from 'preact';
import { Router } from 'preact-router';
import axios from 'axios';

import Header from './header';
import Home from '../routes/home';
import Projects from '../routes/projects';
import Users from '../routes/users';
import users from '../../data/users.json';
import { promisify } from 'util';
// import Home from 'async!../routes/home';
// import Profile from 'async!../routes/profile';

export default class App extends Component {
  state = {
    users: [],
    projects: [],
  };

  /** Gets fired when the route changes.
   *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
   *	@param {string} event.url	The newly routed URL
   */
  handleRoute = (e) => {
    this.currentUrl = e.url;
  };

  componentDidMount() {
    // axios('./data/users.json').then((response) => {
    //   console.log(response);
    //   const users = response.data;
    //   const projects = users.reduce((acc, userRepos) => acc.concat(userRepos), []);
    //   this.setState({ users, projects });
    // });

    const projectMap = {};
    users.forEach(({ repositories }) => {
      repositories.forEach((repo) => {
        projectMap[repo.nameWithOwner] = repo;
      });
    });
    const projects = Object.values(projectMap);
    this.setState({ users, projects });
  }

  render(props, state) {
    return (
      <div id="app">
        <Header />
        <Router onChange={this.handleRoute}>
          <Home path="/" />
          <Projects path="/projects/" projects={state.projects} />
          <Users path="/users/" users={state.users} />
        </Router>
      </div>
    );
  }
}
