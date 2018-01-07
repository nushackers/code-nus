import { h, Component } from 'preact';
import style from './style.css';

export default class Profile extends Component {
  render({ projects }) {
    return (
      <div class={style.profile}>
        {projects.sort((a, b) => b.stargazers - a.stargazers).map((project) => (
          <div>
            <a href={project.url}>{project.nameWithOwner}</a>
            <div>{project.description}</div>
            <div>Stars: {project.stargazers}</div>
          </div>
        ))}
      </div>
    );
  }
}
