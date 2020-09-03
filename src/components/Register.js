import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Form, FormGroup } from 'reactstrap';
import { connect } from 'react-redux';
import { handleRegistration } from '../redux/actions/auth';
import { motion } from 'framer-motion';


class Register extends React.Component {
  state = {
    username: '',
    email: '',
    password: '', 
  }

  handleSubmit = event => {
    event.preventDefault()
    this.props.handleRegistration(this.state, this.props.history)
  }

  handleChange = event => {
    const inputName = event.target.name; // username, password
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
          <Col xs={{ size: 10, offset: 1 }} md={{ size: 6, offset: 3 }}>
            <Form
              className="form-container" 
              method="POST"
              onSubmit={ this.handleSubmit }
            >
              <legend className="mb-4">Register for a new account!</legend>
                <FormGroup>
                  <input 
                    autoComplete="new-password"
                    type="text" 
                    name="username"
                    placeholder="Username"
                    onChange={ this.handleChange } />
                </FormGroup>

                <FormGroup>
                  <input 
                    autoComplete="new-password"
                    type="text" 
                    name="email" 
                    placeholder="Email"             
                    onChange={ this.handleChange } />
                </FormGroup>

                <FormGroup>
                  <input 
                    type="password" 
                    name="password"
                    placeholder="Password"
                    onChange={ this.handleChange } />
                </FormGroup>

                <FormGroup>
                  <button
                  style={{ margin: '20px auto' }} 
                  className="btn custom-btn purple-btn" 
                  type="submit">Sign Up</button>
                </FormGroup>

                
                <small className="text-muted">Already Have An Account? 
                  <Link className="ml-2" to="/login">Log In</Link>
                </small>
                
            </Form>
          </Col>
        </Row>
      </motion.div>
    )
  }
}

export default connect(null, { handleRegistration })(Register)