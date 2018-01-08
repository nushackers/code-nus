import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.scss';

export default class Header extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return (
      <nav className={`navbar navbar-expand-lg navbar-dark fixed-top ${style.header}`}>
        <Link className="navbar-brand" href="/">
          Code@NUS
        </Link>
        <div className="navbar-nav">
          <Link className="nav-item nav-link" activeClassName="active" href="/">
            Home
          </Link>
          <Link className="nav-item nav-link" activeClassName="active" href="/projects">
            Projects
          </Link>
          <Link className="nav-item nav-link" activeClassName="active" href="/users">
            Users
          </Link>
        </div>
      </nav>
    );
  }
}
