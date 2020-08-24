import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, FormGroup } from 'reactstrap';
import { addPoll } from '../../redux/actions/polls';
import { motion } from 'framer-motion';


class NewPollForm extends React.Component {

  state = {
    question: '',
    choices: [
      { choice_text: "" },
      { choice_text: "" }
    ]
  }

  handleSubmit = event => {
    event.preventDefault();
    this.props.addPoll(this.state, this.props.history)

  }

  handleQuestion = event => {
    this.setState({ question: event.target.value })
  }

  handleChoices = (event, index) => {
    let choices = [ ...this.state.choices ]
    choices[index]['choice_text'] = event.target.value 
    this.setState({ choices: choices })
  }

  addChoice = () => {
    this.setState({ 
      choices: this.state.choices.concat([{ choice_text: "" }]) 
    })
  }

  removeChoice = index => {
    console.log("index:", index)
    let choices = [ ...this.state.choices ];
    choices.splice(index, 1);
    this.setState({ choices: choices })
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
        <Col sm="12" md={{ size: 10, offset: 1 }}>
          <div className="content-section">
            <Form 
              className="poll-form"
              onSubmit={ this.handleSubmit  }>
              <legend className="border-bottom mb-4">New Poll</legend>

                <FormGroup className="mb-4 active">
                  <input
                    className="rounded-border"
                    type="text" 
                    name="question"
                    placeholder="What would you like to ask?"
                    onChange={ this.handleQuestion } 
                  />
                </FormGroup>

                
                { this.state.choices.map((field, index) => ( 
                  <FormGroup key={ index } className="mb-4"> 
                    <input
                      className="rounded-border active"
                      type="text" 
                      name="choice"
                      maxLength="20"
                      placeholder={`Choice ${index + 1}`}
                      onChange={ event => this.handleChoices(event, index) } 
                    /> 
                    <span
                      style={{ cursor: 'pointer' }}
                      className="ml-5" 
                      onClick={ () => this.removeChoice(index) }>Remove</span>
                  </FormGroup>  
                  ))
                }
              
                <FormGroup>
                  <span 
                    style={{ cursor: 'pointer' }} 
                    onClick={ this.addChoice }>Add another choice</span>
                </FormGroup>
              <FormGroup>
                <button className="btn custom-btn purple-btn" type="submit">Post</button>        
              </FormGroup>
              
            </Form>
          </div>
        </Col>
      </Row>
    </motion.div>
    )
  }
}

export default connect(null, { addPoll })(NewPollForm)