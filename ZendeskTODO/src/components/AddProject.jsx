import React from 'react';

class AddProject extends React.Component {
  onSubmit(e) {
    if (this._newProjectInput.value !== '') {
      this.props.submitHandler({
        name: this._newProjectInput.value,
      });
    }

    this._newProjectInput.value = '';

    e.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <label>Add Project </label>
        <input placeholder="enter project" ref={(el) => { this._newProjectInput = el; }} />
      </form>
    );
  }
}

export default AddProject;
