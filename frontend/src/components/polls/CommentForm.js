import React from 'react'
import { Form, FormGroup } from 'reactstrap';
import { connect } from 'react-redux';
import { addComment } from '../../redux/actions/comments';


class CommentForm extends React.Component {
  state = {
    comment: ''
  }

  handleComment = event => {
    this.setState({ comment: event.target.value })
  }

  handleSubmit = event => {
    event.preventDefault();
    const { pollId } = this.props;
    this.props.addComment(pollId, this.state);
    this.setState({ comment: '' })
  }

  render() {
    return (
      <Form 
        className="comment-form"
        onSubmit={ this.handleSubmit }>
        <FormGroup>
          <textarea 
            className="rounded-border" 
            placeholder="Add a comment"
            value={ this.state.comment }
            onChange={ this.handleComment }>
          </textarea>
        </FormGroup>
        <FormGroup>
          <button className="btn custom-btn purple-btn" type="submit">Comment</button>
        </FormGroup>
      </Form>
    )
  }
}

export default connect(null, { addComment })(CommentForm)