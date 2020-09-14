import React from 'react';
import { Row, Col } from 'reactstrap';
import { motion } from 'framer-motion';
import { connect } from 'react-redux';
import { activateAccount } from '../redux/actions/auth'

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
                  style={{ margin: '20px auto' }}
                  className="btn custom-btn purple-btn" 
                  onClick={ this.handleClick }
                >
                  Activate
                </button> 
              
            </div>
          </Col>
        </Row>
    
      </motion.div>
    )
  }
}

export default connect(null, { activateAccount })(ActivateAccount)