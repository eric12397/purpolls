import React from 'react';
import PollItem from './PollItem';
import { Card } from 'reactstrap';
import { connect } from 'react-redux';

export class PollList extends React.Component {

	render() {
    let polls = [];
		this.props.polls.forEach(poll => {
      polls.push(
        <Card key={ poll.id } className="content-section mb-4">
          <PollItem 
            poll={ poll }  
          />
        </Card>

      )
		})
      return (
        <div className="card-columns">
          { polls }
        </div>
      )
	  }
  }

const mapStateToProps = state => {
  return {
    polls: state.polls.polls
  }
  
}

export default connect(mapStateToProps)(PollList);