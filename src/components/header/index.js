import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.css';

export default class Header extends Component {
  render() {
    return (
      <header class={style.header}>
        <h1>Code @ NUS</h1>
        <nav>
          <Link activeClassName={style.active} href="/">
            Home
          </Link>
          <Link activeClassName={style.active} href="/projects">
            Projects
          </Link>
          <Link activeClassName={style.active} href="/users">
            Users
          </Link>
        </nav>
      </header>
    );
  }
}
