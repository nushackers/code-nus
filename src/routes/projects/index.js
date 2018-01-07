import { h, Component } from 'preact';
import style from './style.scss';

import Card from './card';

export default class Profile extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.projects.length !== nextProps.projects.length;
  }

  render({ projects }) {
    return (
      <div className={style.projects}>
        {projects
          .sort((a, b) => b.stargazers - a.stargazers)
          .map((project) => <Card {...project} />)}
      </div>
    );
  }
}
