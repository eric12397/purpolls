import React from 'react'
import moment from 'moment';
import axios from 'axios';
import axiosInstance from "../axiosInstance";
import { motion } from 'framer-motion';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi'
import { AiFillLike } from "react-icons/ai";
import { AiFillDislike } from "react-icons/ai";
import { GoCommentDiscussion } from 'react-icons/go';
import { FaCrown } from 'react-icons/fa';
import { FaPoll } from 'react-icons/fa';
import { AiOutlineForm } from "react-icons/ai";
import ProfilePicChanger from "./ProfilePicChanger";
import Tooltip from './Tooltip'

class UserProfile extends React.Component {
  state = {
    image: null
  }

  componentDidMount() {
    const { username } = this.props.match.params;
    axios.get(`http://localhost:8000/api/users/${username}/profile-pic-upload/`, {
      headers: {
        'Authorization' : localStorage.getItem('accessToken') ? "Bearer " + localStorage.getItem('accessToken') : null,
        'accept' : 'application/json',
        'content-type': 'multipart/form-data'

      }
    })
      .then(response => this.setState({ image: response.data.image }))
  }

  uploadImage = event => {
    console.log(event.target.files)
    let formData = new FormData();
    formData.append('image', event.target.files[0]);
    const { username } = this.props.match.params;
    axios.put(`http://localhost:8000/api/users/${username}/profile-pic-upload/`, formData, {
      headers: {
        'Authorization' : localStorage.getItem('accessToken') ? "Bearer " + localStorage.getItem('accessToken') : null,
        'accept' : 'application/json',
        'content-type': 'multipart/form-data'
      }
    })
      .then(response => {
        console.log(response.data)
        this.setState({ image: response.data.image })
      })
      .catch(error => console.log(error))
  }

  render() {
    const totalPolls = this.props.userPolls.length;

    let totalRenown = 0;
    this.props.userPolls.map((poll, index) => {
      for (let i=0; i < poll.choices.length; i++) {
        totalRenown += poll.choices[i].votes
      }
      totalRenown += poll.likes;
      totalRenown += poll.total_comments;
      totalRenown -= poll.dislikes; 
    })

    const userProfile = this.props.userProfile && this.state.image ? (
      <Row>
        <Col lg="4">
          <div className="content-section">
          <div className="media article-metadata">
            <img className="rounded-circle account-img" src={'http://localhost:8000' + this.state.image}/>
            <div className="media-body mt-3" style={{ overflow: 'hidden' }}>
              <h2 className="account-heading">{ this.props.userProfile.username }</h2> 
              <p className="text-secondary">{ this.props.userProfile.email }</p>

              { this.props.userProfile.username === this.props.loggedInUser.username ?
                <ProfilePicChanger uploadImage={ this.uploadImage }/> 
                : '' }
            </div>
          </div>

            <div style={ userStatsContainer }>
              <small>Polls</small>
              <div>
                <FaPoll/>
                <small className="ml-1">{ totalPolls.toLocaleString() }</small>
              </div>
            </div>

            <div style={ userStatsContainer }>
              <small>Renown</small>
                <Tooltip 
                  text={ "Renown Score = Votes + Likes - Dislikes + Comments" }>
                  <div>
                    <FaCrown/>
                    <small className="ml-1">{ totalRenown.toLocaleString() }</small>
                  </div>
                </Tooltip>
            </div>

            <div style={ userStatsContainer }>
              <small>Date joined</small>
              <div>
                <AiOutlineForm/>
                <small className="ml-1">{ moment(this.props.userProfile.date_joined).format('LL') }</small>
              </div>
            </div>

          </div>
        </Col>

        <Col lg="8" >
          <div className="content-section">
            <h2 className="mb-3">Your Polls</h2>

            { this.props.userPolls.map((poll, index) => {
                let totalVotes = 0;
                for (let i=0; i < poll.choices.length; i++) {
                  totalVotes += poll.choices[i].votes
                }
                return (
                  <div className="article-metadata" key={index}>
                    <div style={{ padding: '5px'}}>
                      <Link to={`/polls/${poll.id}`}><h5>{ poll.question_text }</h5></Link>
                      
                      <div style={ pollStatsContainer } >
                        <small>Votes</small>
                        <div>
                          <FiCheckCircle style={{color: '#9365a3'}}/>
                          <small className="ml-1">{ totalVotes.toLocaleString() }</small>
                        </div>
                      </div>
                      
                      <div style={ pollStatsContainer }>
                        <small>Likes</small>
                        <div>
                          <AiFillLike style={{color: '#9365a3'}}/>
                          <small className="ml-1">{ poll.likes.toLocaleString() }</small>
                        </div>
                      </div>

                      <div style={ pollStatsContainer }>
                        <small>Dislikes</small>
                        <div>
                          <AiFillDislike style={{color: '#9365a3'}}/>
                          <small className="ml-1">{ poll.dislikes.toLocaleString() }</small>
                        </div>
                      </div>

                      <div style={ pollStatsContainer } >
                        <small>Comments</small>
                        <div>
                          <GoCommentDiscussion style={{color: '#9365a3'}}/>
                          <small className="ml-2">{ poll.total_comments.toLocaleString() }</small>
                        </div>
                      </div>

                    </div>
                  </div>
                )            
              })
            }
          </div>
        </Col>
      </Row>

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
      { userProfile }
    </motion.div>
    )
  }
}

const pollStatsContainer = {
  display: 'inline-block',
  marginRight: '40px'
}

const userStatsContainer = {
  display: 'inline-block',
  marginRight: '25px',
}

const mapStateToProps = (state, ownProps) => {
  const username = ownProps.match.params.username;
  return {
    userProfile: state.users.users.find(user => user.username === username),
    userPolls: state.polls.polls.filter(poll => poll.author === username),
    loggedInUser: state.auth.user
  }
}
export default connect(mapStateToProps) (UserProfile)