import { h, Component } from 'preact';
import style from './style.scss';

export default class Users extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.users.length !== nextProps.users.length;
  }

  // Note: `user` comes from the URL, courtesy of our router
  render({ users }) {
    return (
      <div className={style.users}>
        {users.sort((a, b) => (a.name || a.login).localeCompare(b.name || b.login)).map((user) => {
          if (!user.repositories.length) return null;
          return (
            <div className={style.profile} style={{ gridRow: `span ${user.repositories.length}` }}>
              {/* TODO: lazyload this <img
              className={style.avatar}
              src={`${user.avatarUrl}&s=64`}
              alt={`${user.name}'s avatar`}
            /> */}
              <a className={style.profileLink} href={`https://github.com/${user.login}`}>
                {user.name || user.login}
              </a>
              <ul className={style.repos}>
                {user.repositories.map((repo) => (
                  <li className={style.repo}>
                    <a className={style.link} href={repo.url}>
                      {repo.nameWithOwner}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    );
  }
}
