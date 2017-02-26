import React from 'react';

import ProjectCounter from './ProjectCounter.jsx';

const ALLOWED_DROP_EFFECT = "move";
const DRAG_DROP_CONTENT_TYPE = "custom_container_type";
const NO_HOVER = -1;
const NONE_SELECTED = -1;

class ProjectList extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      items: this.props.projects,
      selected: NONE_SELECTED,
      hoverOver: NO_HOVER,
    };
  }

  containerAcceptsDropData (transferTypes) {
    return Array.prototype.indexOf.call(transferTypes, DRAG_DROP_CONTENT_TYPE) !== -1;
  }

  resetHover(e) {
    if (this.state.hoverOver !== NO_HOVER) {
      this.setState({ hoverOver: NO_HOVER });
    }
  }

  onDragStart(e) {
    const selectedIndex = parseInt(e.currentTarget.dataset.key);
    e.dataTransfer.effectAllowed = ALLOWED_DROP_EFFECT;
    e.dataTransfer.setData(DRAG_DROP_CONTENT_TYPE, JSON.stringify(this.state.items[selectedIndex]));

    this.setState({ selected: selectedIndex });
  }

  onDragOverItem(e) {
    if (this.containerAcceptsDropData(e.dataTransfer.types)) {
      e.preventDefault();
    }

    let over = parseInt(e.currentTarget.dataset.key);
    if (e.clientY - e.currentTarget.offsetTop > e.currentTarget.offsetHeight / 2) {
      over += 1;
    }

    if (over !== this.state.hoverOver) {
      this.setState({ hoverOver: over });
    }
  }

  onDragOverDropZone(e) {
    if(this.containerAcceptsDropData(e.dataTransfer.types)) {
      e.preventDefault();
    }

    const dropZoneId = parseInt(e.currentTarget.dataset.key);
    if (dropZoneId !== this.state.hoverOver) {
      this.setState({ hoverOver: dropZoneId });
    }
  }

  onDragLeaveContainer(e) {
    const x = e.clientX
        , y = e.clientY
        , top    = e.currentTarget.offsetTop
        , bottom = top + e.currentTarget.offsetHeight
        , left   = e.currentTarget.offsetLeft
        , right  = left + e.currentTarget.offsetWidth;

    if (y <= top || y >= bottom || x <= left || x >= right) {
      this.resetHover();
    }
  }

  onDrop(e) {
    const data = JSON.parse(e.dataTransfer.getData(DRAG_DROP_CONTENT_TYPE));
    if(this.state.hoverOver !== NO_HOVER) {
      this.state.items.splice(this.state.hoverOver, 0, data);
      if(this.state.selected > this.state.hoverOver) {
        this.state.selected += 1;
      }
      this.state.hoverOver = NO_HOVER;
      this.setState(this.state);
    }
  }

  onDragEnd(e) {
    if(e.dataTransfer.dropEffect === ALLOWED_DROP_EFFECT) {
      this.state.items.splice(this.state.selected, 1);
      this.state.hoverOver = NO_HOVER;
      this.state.selected = NONE_SELECTED;
      this.setState(this.state);
      return;
    }

    if(this.state.hoverOver !== NO_HOVER || this.state.selected !== NONE_SELECTED) {
      this.setState({ hoverOver: NO_HOVER, selected: NONE_SELECTED });
    }
  }

  renderDropZone(key, isLast) {
    const dropZoneStyle = {
      height: isLast === true ? '100px' : '',
      transition: this.state.hoverOver === NO_HOVER && this.state.selected === NONE_SELECTED ? 'none' : '',
    };

    return (
      <li key={`dropzone-${key}`}
          data-key={key}
          className={`drop-zone ${this.state.hoverOver === key ? 'drop-zone-active' : ''}`}
          style={dropZoneStyle}
          onDragOver={this.onDragOverDropZone.bind(this)}></li>
    );
  }

  renderProjectItem(key, text) {
    return (<li key={key}
      data-key={key}
      className='project-list-item'
      draggable={true}
      onDragOver={this.onDragOverItem.bind(this)}
      onDragStart={this.onDragStart.bind(this)}
      onDragEnd ={this.onDragEnd.bind(this)}>
        {text}
      </li>);
  }

  renderItems(projects) {
    const items = [];


    let i = 0;
    for (i = 0; i < projects.length; i++) {
      items.push(this.renderDropZone(i));
      items.push(this.renderProjectItem(i, projects[i].name));
    }

    items.push(this.renderDropZone(i, true));

    return items;
  }

  render() {
    const projects = this.renderItems(this.state.items);
    const headerStyle = {
      backgroundColor: this.props.color,
    };

    return (
      <div className="project-list">
        <div className="project-list-header" style={headerStyle}>
          <div className="title">{this.props.name}</div>
          <div>
            <ProjectCounter count={this.state.items.length} />
          </div>

        </div>
        <div>
          <ul ref={(el) => { this._container = el; }}
              onDrop={this.onDrop.bind(this)}
              onDragLeave={this.onDragLeaveContainer.bind(this)}>
              {projects}
          </ul>
        </div>
      </div>
    );
  }
}

export default ProjectList;
