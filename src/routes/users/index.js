import { h, Component } from 'preact';
import style from './style.css';

export default class Users extends Component {
  // Note: `user` comes from the URL, courtesy of our router
  render({ users }) {
    return (
      <div class={style.profile}>
        {users.map((user) => (
          <div>
            <a href={`https://github.com/${user.userId}`}>{user.userId}</a>
          </div>
        ))}
      </div>
    );
  }
}
