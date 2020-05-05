import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom'
import Pages from './pages'

function App() {
  return (
     <Router>
    <Switch>
    <Route  path="/home" component={Pages.Home}>
      </Route>
   
      <Route path="/" component={Pages.Auth}>
      </Route>
    </Switch>
  </Router>
  );
}

export default App;
