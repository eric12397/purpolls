import React from 'react'
import { withAlert } from 'react-alert'
import { connect } from 'react-redux';

class AlertSystem extends React.Component {

  componentDidUpdate(prevProps) {
    const { error, message, alert } = this.props
    if (error !== prevProps.error) {
      if (error.message.username) {
        alert.error(`Username: ${error.message.username}`)
      } if (error.message.password) {
        alert.error(`Password: ${error.message.password}`)
      } if (error.message.email) {
        alert.error(`Email: ${error.message.email}`)
      } if (error.message.detail) {
        alert.error('Username and/or password is incorrect!')
      } if (error.message.question_text) {
        alert.error('Question field is empty!')
      } if (error.message.choices) {
        alert.error('Answer fields are empty!')
      } if (error.message.comment_text) {
        alert.error('Comment field is empty!')
      } if (error.message[0] === "User with given email does not exist.") {
        alert.error('The email you entered was not found in our system. Please enter another email address!')
      }
    }

    if (message !== prevProps.message) {
      if (message.loginSuccess) {
        alert.success(message.loginSuccess)
      } if (message.registerSuccess) {
        alert.success(message.registerSuccess)
      } if (message.pollCreated) {
        alert.success(message.pollCreated)
      } if (message.pollDeleted) {
        alert.success(message.pollDeleted)
      } if (message.resetPasswordRequest) {
        alert.success(message.resetPasswordRequest)
      } if (message.resetPasswordConfirmed) {
        alert.success(message.resetPasswordConfirmed)
      }
      
    }
  }

  render() {
    return (
      <React.Fragment></React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    error: state.errors,
    message: state.messages
  }
}

export default connect(mapStateToProps) (withAlert()(AlertSystem))