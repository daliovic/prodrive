import './index.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';

import PrimeReact from 'primereact/api';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import Router from './Router';

PrimeReact.ripple = true;
ReactDOM.render(
  <BrowserRouter>
  <Router />
</BrowserRouter>,
  document.getElementById('root')
);

