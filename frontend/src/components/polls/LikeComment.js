import React from 'react'
import { AiFillLike } from "react-icons/ai";


class LikeComment extends React.Component {
  
  handleClick = () => {
    this.props.toggleLike()
  }

	render() {
		const { likes } = this.props
		return (
			<React.Fragment>
				<AiFillLike
          className="hover active"
					style={{ color: this.props.commentLiked ? '#943dff' : 'grey' }} 
					onClick={ this.handleClick } >  
				</AiFillLike>
        <span 
          style={ totalCommentLikes }> 
          { likes } 
        </span>
			</React.Fragment>
		)
	}
}

const totalCommentLikes = {
  fontSize: '12px', 
  color: 'e1e1e1',
  marginLeft: '6px'
}

export default LikeComment;