import React from 'react'
import { AiFillDislike } from "react-icons/ai";

class DislikeComment extends React.Component {

  handleClick = () => {
    this.props.toggleDislike()
  }

  render() {
    const { dislikes } = this.props;
    return (
      <React.Fragment>
        <AiFillDislike 
          className="ml-3 hover active" 
          style={{ color: this.props.commentDisliked ? '#943dff' : 'grey' }}
          onClick={ this.handleClick } /> 
        <span 
          className="pl-2" 
          style={{ fontSize: '12px' }}> 
        { dislikes }   
        </span>
      </React.Fragment>
    )
  }
}

export default DislikeComment