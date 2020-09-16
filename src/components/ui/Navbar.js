import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Collapse,
  NavbarToggler
} from 'reactstrap';

const Example = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const loggedInNavbar = (
    <header className="site-header mb-3">
      <nav className="navbar navbar-expand-md navbar-dark bg-steel fixed-top">
        <div className="container">
          <Link to="/" className="navbar-brand brand-text mr-3">purpolls</Link>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <div className="navbar-nav ml-auto">
              <Link onClick={toggle} to="/" className="nav-item nav-link">Home</Link>
              <Link onClick={toggle} to="/add-poll" className="nav-item nav-link">New Poll</Link>
              <Link onClick={toggle} to={`/users/${ props.username }`} className="nav-item nav-link">Profile</Link>
              <Link onClick={toggle} to="/logout" className="nav-item nav-link">Log Out</Link>
            </div>
          </Collapse>
        </div>
      </nav>
    </header>
  );

  const loggedOutNavbar = (
    <header className="site-header mb-3">
      <nav className="navbar navbar-expand-md navbar-dark bg-steel fixed-top">
        <div className="container">
          <Link to="/" className="navbar-brand brand-text mr-3">purpolls</Link>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <div className="navbar-nav ml-auto">
              <Link onClick={toggle} to="/" className="nav-item nav-link">Home</Link>
              <Link onClick={toggle} to="/register" className="nav-item nav-link">Register</Link>
              <Link onClick={toggle} to="/login" className="nav-item nav-link">Log In</Link>
            </div>
          </Collapse>
        </div>
      </nav>
    </header>
  )

  return (
      <div>{ props.isAuthenticated ? loggedInNavbar : loggedOutNavbar }</div>   
    )
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    username: state.auth.user.username
  }
}

export default connect(mapStateToProps)(Example);