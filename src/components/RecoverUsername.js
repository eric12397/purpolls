import React from 'react'
import { Link } from 'react-router-dom';
import { Row, Col, Form, FormGroup } from 'reactstrap';
import { connect } from 'react-redux';
import { motion } from 'framer-motion';


class RecoverUsername extends React.Component {
  state = {
    email: ''
  }

  handleSubmit = event => {
    event.preventDefault()
    console.log(this.state.email)
  }

  handleChange = event => {
    const inputName = event.target.name;
    const inputValue = event.target.value;
    this.setState(prevState => {
      const newState = prevState ;
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
              <legend className="mb-4">Recover your username</legend>
              <FormGroup> 
                <input
                  type="text" 
                  name="email"   
                  placeholder="Email"
                  onChange={ this.handleChange } 
                />
              </FormGroup>

              <FormGroup>
                <button 
                  style={{ margin: '20px auto' }}
                  className="btn custom-btn purple-btn" 
                  type="submit">Email Me</button> 
              </FormGroup>

              <div>
                <small className="text-muted">Forgot your 
                  <Link to="/reset-password"> password</Link> ?
                </small>
              </div>
              <div>
                <small className="text-muted">Already have an account? 
                  <Link className="ml-2" to="/login">Log In</Link>
                </small>
              </div>
              <div>
                <small className="text-muted">Need an account? 
                  <Link className="ml-2" to="/register">Sign Up Now</Link>
                </small>
              </div>
              
            </Form>
          </Col>
        </Row>
    
      </motion.div>
    )
  }
}

export default RecoverUsername;