import React from 'react'
import moment from 'moment';
import { Link } from 'react-router-dom';
import { GoCommentDiscussion } from 'react-icons/go';
import { connect } from 'react-redux';
import ChoiceList from './ChoiceList';

class PollItem extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.vote !== nextProps.vote) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps) {
    if (this.props.vote !== prevProps.vote) {
      console.log(`Poll ${ this.props.poll.id } updated!`)
    }
  }

  render() {
    const {
      question_text: question,
      date_posted: datePosted,
      total_comments: totalComments,
      author,
      id
    } = this.props.poll;

    // calculate total votes from each choice
    const { choices } = this.props.poll;
    let totalVotes = 0;
    for (let i=0; i < choices.length; i++) {
      totalVotes += choices[i].votes
    }

    return (
      <React.Fragment>
        <div className="article-metadata">
          <small className="text-muted">posted by</small>
          <Link to={`/users/${author}`} className="pl-1">{ author }</Link>
          <small className="pl-2 text-muted">
            { moment( datePosted ).fromNow() }
          </small>
        </div>

        <h1>
          <Link to={ `/polls/${id}` }>{ question }</Link>
        </h1>
        <ChoiceList
          pollId={ id } 
          choices={ choices } 
          vote={ this.props.vote } 
        />

        <div style={{width:'100%', textAlign:'center'}}>
          <small style={{ float: 'left'}}>Total Votes: { totalVotes }</small>
          <Link style={{ float: 'right'}} to={`/polls/${id}`}>
            <GoCommentDiscussion className="mr-2"/>
            <small>{ totalComments.toLocaleString() }</small>
          </Link>
        </div>
  
      </React.Fragment>
      
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  vote: state.polls.userVotes.find(vote => vote.poll === ownProps.poll.id)
})

export default connect(mapStateToProps)(PollItem);