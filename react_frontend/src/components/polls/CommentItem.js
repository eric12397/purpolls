import React from 'react';
import moment from 'moment';
import LikeComment from './LikeComment';
import DislikeComment from './DislikeComment';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { toggleCommentLike, toggleCommentDislike } from '../../redux/actions/comments'


class CommentItem extends React.Component {

  toggleLike = () => {
    const { id: commentId, poll_id: pollId } = this.props.comment;
    this.props.toggleCommentLike(commentId, pollId)
  }

  toggleDislike = () => {
    const { id: commentId, poll_id: pollId } = this.props.comment;
    this.props.toggleCommentDislike(commentId, pollId)
  } 

	render() {
		const {
			comment_text: comment,
			date_posted: datePosted,
			author
		  } = this.props.comment
			 
		return (
			<div className="article-metadata">
				<Link to={`/users/${ author }`} className="mr-1">{ author }</Link>
				<small className="text-muted">{ moment( datePosted ).fromNow() }</small>
				<p style={ commentTextFont } className="mt-1">{ comment }</p>

        <div style={ commentBtnContainer }>
  				<LikeComment 
            comment={ this.props.comment } 
            likes={ this.props.likes }
            commentLiked={ this.props.commentLiked }
            toggleLike={ this.toggleLike }
          />	

          <DislikeComment
            comment={ this.props.comment } 
            dislikes={ this.props.dislikes }
            commentDisliked={ this.props.commentDisliked }
            toggleDislike={ this.toggleDislike }
          />
        </div>
			</div>
		)
	}
}

const commentTextFont = {
  fontSize: '15px',
  fontFamily: 'Arial, sans-serif',
  fontWeight: '500'
}

const commentBtnContainer = {
  position: 'relative', 
  bottom: '12px'
}

const mapStateToProps = (state, ownProps) => {
  const commentId = parseInt(ownProps.comment.id);
  return {
    likes: state.comments.commentsLikeCounters[commentId],
    dislikes: state.comments.commentsDislikeCounters[commentId],
    commentLiked: state.comments.commentsLiked[commentId],
    commentDisliked: state.comments.commentsDisliked[commentId]
  }
}

export default connect(mapStateToProps, { toggleCommentLike, toggleCommentDislike })(CommentItem);