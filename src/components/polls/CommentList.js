import React from 'react';
import CommentItem from './CommentItem';
import { connect } from 'react-redux';
import { getComments, getUserCommentLikes, getUserCommentDislikes } from '../../redux/actions/comments'


class CommentList extends React.Component {
  componentDidMount() {
    const { pollId } = this.props
    this.props.getComments(pollId)
    this.props.getUserCommentLikes(pollId)
    this.props.getUserCommentDislikes(pollId)
  }

	render() {
		return this.props.comments.map(comment => (
			<CommentItem 
        key={ comment.id } 
        comment={ comment } 
        userCommentLikes={ this.props.userCommentLikes }
        userCommentDislikes={ this.props.userCommentDislikes }
      />
		))
	}
}

const mapStateToProps = state => {
  return {
    comments: state.comments.comments
  }
}
export default connect(mapStateToProps, { getComments, getUserCommentLikes, getUserCommentDislikes })(CommentList)