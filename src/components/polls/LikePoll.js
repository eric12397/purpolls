import React from 'react';
import { AiFillLike } from "react-icons/ai";

class LikePoll extends React.Component {

  handleClick = () => {
    this.props.toggleLike()
  }

	render() {
		const { likes, pollLiked } = this.props;
		return (
			<React.Fragment>
				<AiFillLike
          className="hover active"
          style={{ color: pollLiked ? '#943dff' : 'grey'  }}
				  onClick={ this.handleClick }	
				/>
        <span 
          className="pl-2" 
          style={{ fontSize: '12px' }}> 
        { likes }   
        </span>
			</React.Fragment>
		)
	}
}


export default LikePoll;