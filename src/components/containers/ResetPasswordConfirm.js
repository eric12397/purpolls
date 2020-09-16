import React from 'react'
import { Link, Redirect } from 'react-router-dom';
import { Row, Col, Form, FormGroup } from 'reactstrap';
import { connect } from 'react-redux';
import { confirmPasswordReset } from '../../redux/actions/auth'
import { motion } from 'framer-motion';

class ResetPasswordConfirm extends React.Component {
  state = {
    new_password: '',
    re_new_password: ''
  }

  handleSubmit = event => {
    event.preventDefault()
    const { uid, token } = this.props.match.params
    const { new_password, re_new_password } = this.state;
    const { history } = this.props;
    
    this.props.confirmPasswordReset(
      uid, 
      token, 
      new_password, 
      re_new_password,
      history
    )
  }

  handleChange = event => {
    const inputName = event.target.name;
    const inputValue = event.target.value;
    this.setState(prevState => {
      const newState = prevState;
      newState[inputName] = inputValue;
      return newState
    })
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
            <Form 
              className="form-container"
              method="post" 
              onSubmit={ this.handleSubmit }>
              <legend className="mb-4">Create a new password</legend>
              <FormGroup> 
                <input
                  type="password" 
                  name="new_password"   
                  placeholder="New password"
                  onChange={ this.handleChange } 
                />
              </FormGroup>

              <FormGroup> 
                <input
                  type="password" 
                  name="re_new_password"   
                  placeholder="Confirm new password"
                  onChange={ this.handleChange } 
                />
              </FormGroup>

              <FormGroup>
                <button 
                  style={{ margin: '20px auto' }}
                  className="btn custom-btn purple-btn" 
                  type="submit">Reset Password</button> 
              </FormGroup>          
            </Form>
          </Col>
        </Row>
    
      </motion.div>
    )
  }
}

export default connect(null, { confirmPasswordReset })(ResetPasswordConfirm)