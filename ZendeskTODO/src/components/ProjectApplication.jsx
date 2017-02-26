import React from 'react';

import AddProject from './AddProject.jsx';
import ProjectCounter from './ProjectCounter.jsx';
import ProjectList from './ProjectList.jsx';

class ProjectApplication extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      projects: [],
    };
  }

  addProject(newProject) {
    const projects = this.state.projects;
    projects.push(newProject);
    this.setState({
      projects
    });
  }

  render() {
    return (
      <div className="container">
        <div className="header">
          <div><AddProject submitHandler={this.addProject.bind(this)} /></div>
          <div>
            <label className="total-label pull-right">TOTAL</label>
          </div>
          <div></div>
          <div><ProjectCounter count={this.state.projects.length}/></div>
        </div>
        <div className="content">
          <div className="project-list-container">
            <ProjectList name="To Do" color="#f45042" projects={this.state.projects} />
          </div>
          <div className="project-list-container">
            <ProjectList name="In Progress" color="#f4d942" projects={[]} />
          </div>
          <div className="project-list-container">
            <ProjectList name="Done" color="#11af2b" projects={[]} />
          </div>
        </div>
      </div>
    );
  }
}

export default ProjectApplication;
