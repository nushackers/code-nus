import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Header from './header';
import Home from '../routes/home';
import Projects from '../routes/projects';
import Users from '../routes/users';
// import Home from 'async!../routes/home';
// import Profile from 'async!../routes/profile';

export default class App extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div id="app">
        <Header />
        <main>
          <Router>
            <Home path="/" />
            <Projects path="/projects/" />
            <Users path="/users/" />
          </Router>
        </main>
      </div>
    );
  }
}
