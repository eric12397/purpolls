import axios from "axios";
import axiosInstance from '../../axiosInstance'
import { createMessage } from './messages';
import { getErrors } from './errors'
import { 
  GET_POLLS, 
  DELETE_POLL, 
  ADD_POLL, 
  HANDLE_VOTE, 
  GET_USER_VOTES,
  GET_USER_LIKES,
  GET_USER_DISLIKES,
  INCREMENT_POLL_LIKES,
  DECREMENT_POLL_LIKES,
  INCREMENT_POLL_DISLIKES,
  DECREMENT_POLL_DISLIKES,
  SET_POLL_LIKES_AND_DISLIKES,
  GET_ERRORS
} from "./types";

const setPollLikesAndDislikes = polls => {
  return { 
    type: SET_POLL_LIKES_AND_DISLIKES,
    payload: polls 
  }
}

export const getPolls = () => (dispatch, getState) => {
  axios.get('http://localhost:8000/api/polls/')
    .then(response => {
      dispatch({
        type: GET_POLLS,
        payload: response.data
      })

      const { polls } = getState().polls
      dispatch(setPollLikesAndDislikes(polls))

    }).catch(error => console.log(error))
}

export const deletePoll = (pollId, history) => dispatch => {
  axiosInstance.delete(`/polls/${pollId}/`)
    .then(response => {
      history.push('/')
      dispatch(createMessage({ pollDeleted: "Poll deleted!"}))
      dispatch({
        type: DELETE_POLL,
        payload: pollId
      })
      
    }).catch(error => console.log(error))
}

export const addPoll = (data, history) => (dispatch, getState) => {
  const { id: userId } = getState().auth.user
  axiosInstance.post('http://localhost:8000/api/polls/', {
    author: userId,
    question_text: data.question,
    choices: data.choices
  })
    .then(response => {
      dispatch(createMessage({ pollCreated: "Poll created successfully!"}))
      dispatch({
        type: ADD_POLL,
        payload: response.data
      })
      history.push('/')
      const { polls } = getState().polls
      dispatch(setPollLikesAndDislikes(polls))
    })

    .catch(error => dispatch(getErrors(error.response)))
}

export const handleVote = (choiceId, pollId, history) => (dispatch, getState) => {
  const { user, isAuthenticated } = getState().auth

  if (isAuthenticated === true) {
    axiosInstance.post(`/polls/${pollId}/votes/`, {
    selected_choice_id: choiceId,
    user_id: user.id
  })
    .then(response => {
      dispatch({
        type: HANDLE_VOTE,
        payload: response.data
      })

    }).catch(error => console.log(error)) 
       
  } else {
    dispatch(createMessage({ logInFirst: "You must log in to vote!"}))
    history.push('/login')
  }  
}

export const getUserVotes = userId => dispatch => {
  axios.get(`http://localhost:8000/api/users/${userId}/votes/`)
    .then(response => {
      dispatch({
        type: GET_USER_VOTES,
        payload: response.data
      })

    }).catch(error => console.log(error))
}

export const getUserLikes = userId => dispatch => {
  axios.get(`http://localhost:8000/api/users/${userId}/likes/`)
    .then(response => {
      dispatch({
        type: GET_USER_LIKES,
        payload: response.data
      })
    })
}

export const getUserDislikes = userId => dispatch => {
  axios.get(`http://localhost:8000/api/users/${userId}/dislikes/`)
    .then(response => {
      dispatch({
        type: GET_USER_DISLIKES,
        payload: response.data
      })
    })
}

export const togglePollLike = pollId => (dispatch, getState) => {
  const { id: userId } = getState().auth.user
  const { 
    pollsLiked, 
    pollsDisliked, 
    pollsLikeCounters, 
    pollsDislikeCounters 
  } = getState().polls

  const pollLiked = pollsLiked[pollId];
  const pollDisliked = pollsDisliked[pollId]

  if (pollLiked === undefined && pollDisliked === undefined) {
    axiosInstance.patch(`/polls/${pollId}/likes/`, {
      signal: 'add like',
      user_id: userId,
      likes: pollsLikeCounters[pollId] + 1, 
    })
      .then(response => console.log(response.data))

    dispatch({ 
      type: INCREMENT_POLL_LIKES, 
      payload: pollId
    })    
  }

  if (pollLiked === true && pollDisliked === undefined) {
    axiosInstance.patch(`/polls/${pollId}/likes/`, {
      signal: 'remove like',
      user_id: userId,
      likes: pollsLikeCounters[pollId] - 1,
    })
      .then(response => console.log(response.data)) 

    dispatch({ 
      type: DECREMENT_POLL_LIKES, 
      payload: pollId 
    })    
  }

  if (pollLiked === undefined && pollDisliked === true) {
    axiosInstance.patch(`/polls/${pollId}/likes/`, {
      signal: 'add like, remove dislike',
      user_id: userId,
      likes: pollsLikeCounters[pollId] + 1, 
      dislikes: pollsDislikeCounters[pollId] - 1, 
    })
      .then(response => console.log(response.data))

    dispatch({ 
      type: INCREMENT_POLL_LIKES, 
      payload: pollId 
    })
    dispatch({ 
      type: DECREMENT_POLL_DISLIKES,
      payload: pollId
    })
  }
}

export const togglePollDislike = pollId => (dispatch, getState) => {
  const { id: userId } = getState().auth.user
  const { 
    pollsLiked, 
    pollsDisliked, 
    pollsLikeCounters, 
    pollsDislikeCounters 
  } = getState().polls

  const pollLiked = pollsLiked[pollId];
  const pollDisliked = pollsDisliked[pollId]
  
  if (pollLiked === undefined && pollDisliked === undefined) {
    axiosInstance.patch(`/polls/${pollId}/dislikes/`, {
      signal: 'add dislike',
      user_id: userId,
      dislikes: pollsDislikeCounters[pollId] + 1
    })
      .then(response => console.log(response.data))

    dispatch({ 
      type: INCREMENT_POLL_DISLIKES,
      payload: pollId
    })
  }

  if (pollLiked === undefined && pollDisliked === true) {
    axiosInstance.patch(`/polls/${pollId}/dislikes/`, {
      signal: 'remove dislike',
      user_id: userId,
      dislikes: pollsDislikeCounters[pollId] - 1
    })
      .then(response => console.log(response.data))

    dispatch({ 
      type: DECREMENT_POLL_DISLIKES, 
      payload: pollId 
    }) 
  }

  if (pollLiked === true && pollDisliked === undefined) {
    axiosInstance.patch(`/polls/${pollId}/dislikes/`, {
      signal: 'add dislike, remove like',
      user_id: userId,
      dislikes: pollsDislikeCounters[pollId] + 1,
      likes: pollsLikeCounters[pollId] - 1,
    })
      .then(response => console.log(response.data))

    dispatch({ 
      type: DECREMENT_POLL_LIKES,
      payload: pollId 
    })
    dispatch({ 
      type: INCREMENT_POLL_DISLIKES, 
      payload: pollId
    })
  }
}
