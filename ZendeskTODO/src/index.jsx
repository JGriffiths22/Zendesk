import React from 'react';
import ReactDOM from 'react-dom';

import ProjectApplication from './components/ProjectApplication.jsx';

require('./stylesheets/main.css');

ReactDOM.render(
  <ProjectApplication />,
  document.getElementById('container')
);
