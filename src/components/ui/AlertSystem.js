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
      }  if (error.message.question_text) {
        alert.error('Question field is empty!')
      } if (error.message.choices) {
        alert.error('Answer fields are empty!')
      } if (error.message.comment_text) {
        alert.error('Comment field is empty!')
      } if (error.message[0] === "User with given email does not exist.") {
        alert.error('The email you entered was not found in our system. Please enter another email address!')
      } if (error.message.non_field_errors) {
        alert.error(error.message.non_field_errors)
      } if (error.message.detail) {
        alert.error(`${error.message.detail}.`)
      } if (error.message.new_password) {
        alert.error(error.message.new_password)
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
      } if (message.passwordResetRequested) {
        alert.success(message.passwordResetRequested)
      } if (message.passwordResetConfirmed) {
        alert.success(message.passwordResetConfirmed)
      } if (message.activationEmailSent) {
        alert.success(message.activationEmailSent)
      } if (message.accountActivated) {
        alert.success(message.accountActivated)
      } if (message.passwordsMustMatch) {
        alert.error(message.passwordsMustMatch)
      } if (message.logInFirst) {
        alert.error(message.logInFirst)
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