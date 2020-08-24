import React from 'react';
import moment from 'moment';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import LikePoll from './LikePoll';
import DislikePoll from './DislikePoll';
import Modal from '../Modal';
import ChoiceList from './ChoiceList';
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TiDelete } from 'react-icons/ti';
import { AiOutlineDoubleLeft } from 'react-icons/ai';
import { AiOutlineDoubleRight } from 'react-icons/ai';
import { connect } from 'react-redux';
import { deletePoll, togglePollLike, togglePollDislike } from '../../redux/actions/polls';


class PollDetail extends React.Component {
	state = {
    showModal: false
	}

	toggleLike = () => {
    const { id } = this.props.poll;
    this.props.togglePollLike(id)
  }
	
  toggleDislike = () => {
    const { id } = this.props.poll;
    this.props.togglePollDislike(id)
  }

  deletePoll = () => {
    const { id } = this.props.poll;
    this.props.deletePoll(id, this.props.history);
  }

  showModal = () => {
    this.setState({ showModal: true })
  }

  closeModal = () => {
    this.setState({ showModal: false })
  }

  getNextPollId = () => {
    const { polls } = this.props;
    const { id: pollId } = this.props.match.params
    const index = polls.findIndex(poll => poll.id === parseInt(pollId))
    try {
      return polls[index + 1].id
    } catch (e) {
      return polls[0].id
    }
  }

  getPreviousPollId = () => {
    const { polls } = this.props;
    const { id: pollId } = this.props.match.params
    const index = polls.findIndex(poll => poll.id === parseInt(pollId))
    try {
      return polls[index - 1].id
    } catch (e) {
      return polls[polls.length - 1].id
    }
  }

	render() { 
    const poll = this.props.poll ? (
      <article 
        className="media content-section" 
      >   
        
          <div className="media-body">
            <div className="article-metadata">
              <small className="text-muted">posted by</small>
              <Link to={`/users/${ this.props.poll.author }`} className="pl-1">{ this.props.poll.author }</Link>
              <small className="pl-2 text-muted">{ moment( this.props.poll.date_posted ).fromNow() }</small> 
              
              { this.props.username === this.props.poll.author ? 
                <TiDelete 
                  style={ deletePollBtn } 
                  onClick={ this.showModal }/>
                : '' }
            </div>

            <h2>{ this.props.poll.question_text }</h2> 

            { this.props.vote ? 
              <p> You selected "{ this.props.vote.choice_text }".</p> : ''} 

            <div style={ choicesContainer }>
              <div style={ pageTransitionLeftBtn }>
                <Link 
                  className="mr-2" 
                  to={`/polls/${this.getPreviousPollId()}`}
                >
                  <AiOutlineDoubleLeft />
                </Link>
              </div>
              
              <ChoiceList
                pollId={ this.props.poll.id } 
                choices={ this.props.poll.choices }
                vote={ this.props.vote } 
              />
              
              
              <div style={ pageTransitionRightBtn }>
                <Link 
                  className="mr-2" 
                  to={`/polls/${this.getNextPollId()}`}
                >
                  <AiOutlineDoubleRight />
                </Link>
              </div>
            </div>
      
            <Modal showModal={ this.state.showModal } closeModal={ this.closeModal }>
              <h1>Are you sure you want to delete this poll?</h1>
              <button className="btn custom-btn red-btn mb-2" onClick={ this.deletePoll }>Delete</button>{' '}
              <button className="btn custom-btn purple-btn" onClick={ this.closeModal }>Cancel</button> 
            </Modal>

            <div className="mb-3" style={{ float: 'left' }}>
              
              <LikePoll 
                likes={ this.props.likes } 
                pollLiked={ this.props.pollLiked }
                toggleLike={ this.toggleLike }  
              />

              <DislikePoll
                dislikes={ this.props.dislikes }
                pollDisliked={ this.props.pollDisliked }
                toggleDislike={ this.toggleDislike }
              />
            </div>

            <CommentForm pollId={ this.props.poll.id } />
            <CommentList pollId={ this.props.poll.id } />
            
          </div>
        </article>
      
    ) : (

    <div> Loading... please wait. </div> 

    )

		return (
      <motion.div
        initial={{opacity: 0, x: '-100vh'}}
        animate={{opacity: 1, x: 0}}
        exit={{opacity: 0, x: '-100vh'}} 
        transition={{transition: 'linear'}}
      >
      <Row>
        <Col xs="12" md={{ size: 10, offset: 1 }}>
				  { poll } 
        </Col>
      </Row>
      </motion.div>
		)
	}
}

const choicesContainer = {
  width: '100%',  
  position: 'relative'
}

const deletePollBtn = {
  float: 'right', 
  cursor: 'pointer',
  fontSize: '20px'
}

const pageTransitionRightBtn = {
  display: 'block',
  fontSize: '35px',
  position: 'absolute',
  right: '-80px',
  top: '30%',
  cursor: 'pointer'
}

const pageTransitionLeftBtn = {
  display: 'block',
  fontSize: '35px',
  position: 'absolute',
  left: '-75px',
  top: '30%',
  cursor: 'pointer'
}

const mapStateToProps = (state, ownProps) => {
  const pollId = parseInt(ownProps.match.params.id);
  return {
    polls: state.polls.polls,
    poll: state.polls.polls.find(poll => poll.id === pollId),
    likes: state.polls.pollsLikeCounters[pollId],
    dislikes: state.polls.pollsDislikeCounters[pollId],
    pollLiked: state.polls.pollsLiked[pollId],
    pollDisliked: state.polls.pollsDisliked[pollId],
    vote: state.polls.userVotes.find(vote => vote.poll === pollId),
    username: state.auth.user.username
  }
}

export default connect(mapStateToProps, { deletePoll, togglePollDislike, togglePollLike })(PollDetail)