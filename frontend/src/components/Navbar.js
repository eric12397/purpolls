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
              <Link to="/" className="nav-item nav-link">Home</Link>
              <Link to="/add-poll" className="nav-item nav-link">New Poll</Link>
              <Link to={`/users/${ props.username }`} className="nav-item nav-link">Profile</Link>
              <Link to="/logout" className="nav-item nav-link">Log Out</Link>
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
              <Link to="/" className="nav-item nav-link">Home</Link>
              <Link to="/register" className="nav-item nav-link">Register</Link>
              <Link to="/login" className="nav-item nav-link">Log In</Link>
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

//export default Example;
/*const Navbar = (props) => {
	const loggedOutNavbar = (
			<header className="site-header mb-3">
        <nav className="navbar navbar-expand-md bg-steel fixed-top">
          <div className="container">
            <Link to="/" className="navbar-brand brand-text mr-3">purpolls</Link>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
              <div className="navbar-nav mr-auto"></div>
              <div className="navbar-nav">
                  <Link to="/" className="nav-item nav-link">Home</Link>
                  <Link to="/register" className="nav-item nav-link">Register</Link>
                  <Link to="/login" className="nav-item nav-link">Log In</Link>
              </div>
            </Collapse>
          </div>
        </nav>
      </header>
		)

	const loggedInNavbar = (
		<header className="site-header mb-3">
      <nav className="navbar navbar-expand-md navbar-dark bg-steel fixed-top">
        <div className="container">
          <Link to="/" className="navbar-brand brand-text mr-3">purpolls</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggle" aria-controls="navbarToggle" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarToggle">
            <div className="navbar-nav mr-auto"></div>
            <div className="navbar-nav">
                <Link to="/" className="nav-item nav-link">Home</Link>
                <Link to="/add-poll" className="nav-item nav-link">New Poll</Link>
                <Link to={`/users/${ props.username }`} className="nav-item nav-link">Profile</Link>
                <Link to="/logout" className="nav-item nav-link">Log Out</Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
	)
		return (
			<div>{ props.isAuthenticated ? loggedInNavbar : loggedOutNavbar }</div>		
		)
	}*/

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    username: state.auth.user.username
  }
}

export default connect(mapStateToProps)(Example);