import { h } from 'preact';
import style from './style.scss';

/* eslint-disable react/no-danger */
export default function Card({
  hit: {
    nameWithOwner,
    url,
    descriptionHTML,
    primaryLanguage,
    homepageUrl,
    repositoryTopics,
    stargazers,
  },
}) {
  const [owner, name] = nameWithOwner.split('/');
  return (
    <div className="card">
      <div>
        <h3 className="h4">
          <a href={url}>
            <span className="font-weight-normal">{owner} / </span>
            {name}
          </a>
        </h3>
        <p
          dangerouslySetInnerHTML={{
            __html: descriptionHTML,
          }}
        />
      </div>
      <div>
        {homepageUrl && (
          <p>
            Homepage:
            <a className={style.link} href={homepageUrl}>
              {homepageUrl}
            </a>
          </p>
        )}
        {repositoryTopics.length > 0 && (
          <p>{repositoryTopics.map((topic) => <span className={style.topic}>{topic}</span>)}</p>
        )}
        <div className={style.info}>
          <span className={style.detail}>{primaryLanguage}</span>
          <span className={style.detail}>
            <span role="img" aria-label="star">
              ⭐
            </span>{' '}
            {stargazers}
          </span>
        </div>
      </div>
    </div>
  );
}
