import React from 'react';

class ProjectCounter extends React.Component {
  render() {
    return (
      <div className="project-counter-box">
        <div>{this.props.count}</div>
        <div>PROJECTS</div>
      </div>
    );
  }
}

export default ProjectCounter;
