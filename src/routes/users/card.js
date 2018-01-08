import { h } from 'preact';
import style from './style.scss';

export default function Card({ hit: { login, name, repositories, avatarUrl } }) {
  return (
    <div className="card" style={{ gridRow: `span ${repositories.length}` }}>
      <img className={style.avatar} src={`${avatarUrl}&s=64`} alt={`${name}'s avatar`} />
      <a className={style.profileLink} href={`https://github.com/${login}`}>
        {name || login}
      </a>
      <ul className={style.repos}>
        {repositories.length > 0 &&
          repositories.map((repo) => (
            <li className={style.repo}>
              <a className={style.link} href={repo.url}>
                {repo.nameWithOwner}
              </a>
            </li>
          ))}
      </ul>
    </div>
  );
}
