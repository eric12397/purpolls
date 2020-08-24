import React from 'react'
import './ChoiceItem.css'
import { connect } from 'react-redux';
import { handleVote } from '../../redux/actions/polls';
import { withRouter } from 'react-router';

class ChoiceItem extends React.Component {
  
  handleVote = () => {
    const { id: choiceId } = this.props.choice;
    const { pollId, history } = this.props;
    this.props.handleVote(choiceId, pollId, history)
  }

	render() {
		const { choice_text, percent } = this.props.choice 

		return (
			<div 
        style={{ border: this.props.vote ? '0px' : '2px solid #943dff' }}
        className={`choice-btn ${ this.props.vote ? "" : "choice-btn-hover"}`} 
        data-label={ choice_text }
        onClick={ this.handleVote }
      >
				<span style={{ width: this.props.vote ? `${ percent }%` : '' }} className="bar"></span>
  			<p className="percent">{ this.props.vote ? `${ percent }%` : '' }</p>    
			</div>			 
		)
	}
}

export default connect(null, { handleVote }) (withRouter(ChoiceItem))