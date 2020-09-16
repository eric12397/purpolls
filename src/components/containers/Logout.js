import React from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { handleLogout } from '../../redux/actions/auth'
import { motion } from 'framer-motion';


class Logout extends React.Component {

  componentDidMount() {
    this.props.handleLogout()
  }
  
  render() {
    return (
      <motion.div
        initial={{opacity: 0, x: '-100vh'}}
        animate={{opacity: 1, x: 0}}
        exit={{opacity: 0, x: '-100vh'}} 
      >
        <h2>You have been logged out</h2>
        <div className="border-top pt-3">
          <small className="text-muted">
            <Link to="/login">Log In Again</Link>
          </small>
        </div>  
      </motion.div>
    )
  }
}

export default connect(null, { handleLogout })(Logout)

