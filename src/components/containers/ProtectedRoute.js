import React from 'react';
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { motion } from 'framer-motion';


class ProtectedRoute extends React.Component {
  render() {
    const { component: Component, ...props } = this.props

    return (
      <Route { ...props }
        render={ props => (
          this.props.isAuthenticated ? 
          <Component { ...props } /> :

          <motion.div
            initial={{opacity: 0, x: '-100vh'}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, x: '-100vh'}} 
          >
            <Redirect to="/login" /> 
          </motion.div>
        )} 
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.isAuthenticated
  }
}

export default connect(mapStateToProps)(ProtectedRoute)