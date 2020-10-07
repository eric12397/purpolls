import React from 'react'
import { connect } from 'react-redux';
import { handleVote } from '../../redux/actions/polls';
import { withRouter } from 'react-router';

class ChoiceItem extends React.Component {

  selectedChoiceStyle = () => {    
    if (this.props.vote) {
      return {
        width: `${ this.props.choice.percent }%`,
        background: this.props.vote.choice_text === this.props.choice.choice_text ? 'linear-gradient(120deg, rgba(148,61,255,1) 0%, rgba(157,67,168,1) 100%)' 
          : '#42413a'
      }
    }
  }

  handleVote = () => {
    const { id: choiceId } = this.props.choice;
    const { pollId, history } = this.props;
    this.props.handleVote(choiceId, pollId, history)
  }

	render() {
		const { choice_text, percent } = this.props.choice 

		return (
			<div 
        style={{ border: this.props.vote ? '0px' : '1px solid #943dff' }}
        className={`choice-btn ${ this.props.vote ? "" : "choice-btn-hover"}`} 
        data-label={ choice_text }
        onClick={ this.handleVote }
      >
				<span 
          style={ this.selectedChoiceStyle() } 
          className="bar"
        >
        </span>
  			<p className="percent">{ this.props.vote ? `${ percent }%` : '' }</p>    
			</div>			 
		)
	}
}



export default connect(null, { handleVote }) (withRouter(ChoiceItem))