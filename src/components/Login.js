import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Form, FormGroup } from 'reactstrap';
import { connect } from 'react-redux';
import { handleLogin } from '../redux/actions/auth'
import { motion } from 'framer-motion';


class Login extends React.Component {
	state = {
		email: '',
		password: ''
	}

  handleSubmit = event => {
    event.preventDefault()
    this.props.handleLogin(this.state, this.props.history)
  }

	handleChange = event => {
		const inputName = event.target.name; // email, password
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
    					<legend className="mb-4">Log In</legend>
              <FormGroup> 
  							<input
  								type="text" 
  								name="email"		
                  placeholder="Email*"
  								onChange={ this.handleChange } 
                />
              </FormGroup>

              <FormGroup>
  							<input 
  								type="password" 
  								name="password"
                  placeholder="Password*"								
  								onChange={ this.handleChange } 
                />
  					  </FormGroup>

              <FormGroup>
                <button 
                  style={{ margin: '20px auto' }}
                  className="btn custom-btn purple-btn" 
                  type="submit">Login</button> 
              </FormGroup>

      				<div>
    					  <small className="text-muted">Need an account? 
                  <Link className="ml-2" to="/register">Sign Up Now</Link>
    					  </small>
              </div>
              <div>
                <small className="text-muted">Forgot your 
                  <Link to="/reset-password"> account</Link> ?
                </small>
              </div>
        

            </Form>
          </Col>
        </Row>
          
    		
      </motion.div>
		)
	}
}

export default connect(null, { handleLogin })(Login);

