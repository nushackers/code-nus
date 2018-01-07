import { h, Component } from 'preact';
import style from './style.css';

export default class Users extends Component {
  // Note: `user` comes from the URL, courtesy of our router
  render({ users }) {
    return (
      <div class={style.users}>
        {users.sort((a, b) => (a.name || a.login).localeCompare(b.name || b.login)).map((user) => (
          <div className={style.profile}>
            <img
              className={style.avatar}
              src={`${user.avatarUrl}&s=64`}
              alt={`${user.name}'s avatar`}
            />
            <a className={style.profileLink} href={`https://github.com/${user.login}`}>
              {user.name || user.login}
            </a>
          </div>
        ))}
      </div>
    );
  }
}
