import { h, Component } from 'preact';
import style from './style.scss';

export default class Home extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className={`container card-static ${style.home}`}>
        <h1 className="display-1">Code@NUS</h1>
        <p className="lead">The home for open source contributors and projects by NUS students.</p>

        <h2>Open source community</h2>
        <p>
          The NUS open source community is small but vibrant. Check out the list of projects that
          your fellow students have created and join us!
        </p>

        <h3>Getting started</h3>

        <h6>Learn git</h6>
        <p>
          Git is a version control system, essential for any developer.{' '}
          <a href="https://www.atlassian.com/git/tutorials/what-is-version-control">Learn more</a>{' '}
          or <a href="https://try.github.io/">try an interactive tutorial</a>
        </p>

        <h6>Helping out</h6>
        <p>
          Submitting issues is a simple way to start. To go one step further is to submit a pull
          request. Beginners can look for issues tagged with &quot;first-timers-only&quot;, the
          maintainers will help you out!
        </p>

        <h6>Your first pull request</h6>
        <p>
          Submit a{' '}
          <a href="https://www.atlassian.com/git/tutorials/making-a-pull-request">pull request</a>{' '}
          and wait! You&apos;re on your way to becoming an open source contributor.
        </p>

        <h4>This project</h4>
        <p>
          Code @ NUS is an open source project too. Help us out{' '}
          <a href="https://github.com/nushackers/code-nus">here!</a>
        </p>
      </div>
    );
  }
}
