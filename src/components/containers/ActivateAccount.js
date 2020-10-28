import React from 'react';
import { Row, Col, Spinner } from 'reactstrap';
import { motion } from 'framer-motion';
import { connect } from 'react-redux';
import { activateAccount } from '../../redux/actions/auth'

class ActivateAccount extends React.Component {
  handleClick = () => {
    const { uid, token } = this.props.match.params
    const { history } = this.props;
    this.props.activateAccount(uid, token, history)
  }
  
  render() {
    return (
      <motion.div
        initial={{opacity: 0, x: '-100vh'}}
        animate={{opacity: 1, x: 0}}
        exit={{opacity: 0, x: '-100vh'}} 
        transition={{transition: 'linear'}}
      >
      
        <Row>
          <Col md={{ size: 10, offset: 1 }} lg={{ size: 6, offset: 3 }}>
            <div className="form-container"> 
              
              <legend className="mb-4">Activate your account!</legend>
              
                <button 
                  className="btn custom-btn purple-btn mb-3" 
                  onClick={ this.handleClick }
                >
                  Activate
                </button> 

                { this.props.isLoading ? <Spinner className="mt-3" color="primary" /> : ''}
              
            </div>
          </Col>
        </Row>
    
      </motion.div>
    )
  }
}

const mapStateToProps = state => {
  return {
    isLoading: state.auth.isLoading
  }
}

export default connect(mapStateToProps, { activateAccount })(ActivateAccount)