import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/layout/NavBar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layout/Alert';
import setAuthToken from './utils/setAuthToken';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';

import './App.css';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Fragment>
        <Router>
          <NavBar />
          <Alert />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
          </Routes>
        </Router>
      </Fragment>
    </Provider>
  );
};

export default App;
