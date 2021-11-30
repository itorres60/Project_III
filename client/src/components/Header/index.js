import React from 'react';
import { Link } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu'

// import styles from './burger_styles.css'



import Auth from '../../utils/auth';
import CreateCalendarModal from '../../utils/modal';

const Header = () => {
  const logout = event => {
    event.preventDefault();
    Auth.logout();
  };

  return (
    <header  className="bg-tertiary mb-4 py-2 flex-row align-center">


      <div className="container flex-row justify-space-between-lg justify-center align-center">
        <Link to="/">
          <h1>Relief & Rotation</h1>
        </Link>

          

        <nav className="text-center nav-bar">
          {Auth.loggedIn() ? (
            <>
            <div id='modalTarget'>
            <CreateCalendarModal></CreateCalendarModal>
            </div>
              <a href="/" onClick={logout}>
                Logout
              </a>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
