import React, { Fragment } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { logout } from '../../actions/auth';
import { useDispatch, useSelector } from 'react-redux';

const NavBar = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.isAuthenticated);

  const onLogout = () => {
    dispatch(logout());
  };

  const authLinks = (
    <ul>
      <li>
        <Link onClick={() => onLogout()} to="/">
          <i className="fas fa-sign-out-alt"></i> <span className="hide-sm">Logout</span>
        </Link>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <a href="#!">Developers</a>
      </li>
      <li>
        <Link to="register">Register</Link>
      </li>
      <li>
        <Link to="login">Login</Link>
      </li>
    </ul>
  );
  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code"></i> DevConnector
        </Link>
      </h1>

      <Fragment>{auth ? authLinks : guestLinks}</Fragment>
    </nav>
  );
};

export default NavBar;
