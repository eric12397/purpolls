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
  REMOVE_USER_VOTES,
  REMOVE_USER_LIKES,
  REMOVE_USER_DISLIKES,
  ADD_LIKE,
  ADD_LIKE_AND_REMOVE_DISLIKE,
  REMOVE_LIKE,
  ADD_DISLIKE,
  ADD_DISLIKE_AND_REMOVE_LIKE,
  REMOVE_DISLIKE
} from "./types";

// thunks
export const getPolls = () => (dispatch, getState) => {
  return axiosInstance.get('/polls/')
    .then(response => dispatch(getPollsSuccess(response.data)))
    .catch(error => console.log(error))
}

export const deletePoll = (pollId, history) => dispatch => {
  axiosInstance.delete(`/polls/${pollId}/`)
    .then(response => {
      history.push('/')
      dispatch(createMessage({ pollDeleted: "Poll deleted!"}))
      dispatch(deletePollSuccess(pollId))
    })
    .catch(error => console.log(error))
}

export const addPoll = (data, history) => (dispatch, getState) => {
  const { id: userId } = getState().auth.user
  axiosInstance.post('/polls/', {
    author: userId,
    question_text: data.question,
    choices: data.choices
  })
    .then(response => {
      dispatch(createMessage({ pollCreated: "Poll created successfully!"}))
      dispatch(addPollSuccess(response.data))
      history.push('/') 
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
    .then(response => dispatch(handleVoteSuccess(response.data)))
    .catch(error => console.log(error)) 
  } else {
    dispatch(createMessage({ logInFirst: "You must log in to vote!" }))
    history.push('/login')
  }  
}

export const getUserVotes = userId => dispatch => {
  axiosInstance.get(`/users/${userId}/votes/`)
    .then(response => dispatch(getUserVotesSuccess(response.data)))
    .catch(error => console.log(error))
}

export const getUserLikes = userId => dispatch => {
  axiosInstance.get(`/users/${userId}/likes/`)
    .then(response => dispatch(getUserLikesSuccess(response.data)))
    .catch(error => console.log(error))
}

export const getUserDislikes = userId => dispatch => {
  axiosInstance.get(`/users/${userId}/dislikes/`)
    .then(response => dispatch(getUserDislikesSuccess(response.data)))
    .catch(error => console.log(error))
}

export const togglePollLike = pollId => (dispatch, getState) => {
  const { id: userId } = getState().auth.user
  const { pollsLiked, pollsDisliked } = getState().polls

  const pollLiked = pollsLiked[pollId];
  const pollDisliked = pollsDisliked[pollId]

  if (pollLiked === undefined && pollDisliked === undefined) {
    axiosInstance.patch(`/polls/${pollId}/likes/`, {
      signal: ADD_LIKE,
      user_id: userId
    })
      .then(response => dispatch(addLike(response.data)))
      .catch(error => console.log(error))
  }

  else if (pollLiked === true && pollDisliked === undefined) {
    axiosInstance.patch(`/polls/${pollId}/likes/`, {
      signal: REMOVE_LIKE,
      user_id: userId
    })
      .then(response => dispatch(removeLike(response.data)))
      .catch(error => console.log(error))
  } 

  else if (pollLiked === undefined && pollDisliked === true) {
    axiosInstance.patch(`/polls/${pollId}/likes/`, {
      signal: ADD_LIKE_AND_REMOVE_DISLIKE,
      user_id: userId
    })
      .then(response => dispatch(addLikeAndRemoveDislike(response.data)))
      .catch(error => console.log(error))
  }
}

export const togglePollDislike = pollId => (dispatch, getState) => {
  const { id: userId } = getState().auth.user
  const { pollsLiked, pollsDisliked } = getState().polls

  const pollLiked = pollsLiked[pollId];
  const pollDisliked = pollsDisliked[pollId]

  if (pollLiked === undefined && pollDisliked === undefined) {
    axiosInstance.patch(`/polls/${pollId}/likes/`, {
      signal: ADD_DISLIKE,
      user_id: userId
    })
      .then(response => dispatch(addDislike(response.data)))
      .catch(error => console.log(error))
  }

  else if (pollLiked === undefined && pollDisliked === true) {
    axiosInstance.patch(`/polls/${pollId}/likes/`, {
      signal: REMOVE_DISLIKE,
      user_id: userId
    })
      .then(response => dispatch(removeDislike(response.data)))
      .catch(error => console.log(error))
  }

  else if (pollLiked === true && pollDisliked === undefined) {
    axiosInstance.patch(`/polls/${pollId}/likes/`, {
      signal: ADD_DISLIKE_AND_REMOVE_LIKE,
      user_id: userId
    })
      .then(response => dispatch(addDislikeAndRemoveLike(response.data)))
      .catch(error => console.log(error))
  }
}

// action creators
const getPollsSuccess = polls => {
  return {
    type: GET_POLLS,
    payload: polls
  }
}

const deletePollSuccess = pollId => {
  return {
    type: DELETE_POLL,
    payload: pollId
  }
}

const addPollSuccess = newPoll => {
  return {
    type: ADD_POLL,
    payload: newPoll
  }
}

const handleVoteSuccess = userVote => {
  return {
    type: HANDLE_VOTE,
    payload: userVote
  }
}

const getUserVotesSuccess = userVotes => {
  return {
    type: GET_USER_VOTES,
    payload: userVotes
  }
}

const getUserLikesSuccess = userLikes => {
  return {
    type: GET_USER_LIKES,
    payload: userLikes
  }
}

const getUserDislikesSuccess = userDislikes => {
  return {
    type: GET_USER_DISLIKES,
    payload: userDislikes
  }
}

export const addLike = poll => {
  return {
    type: ADD_LIKE,
    payload: poll 
  }
}

export const removeLike = poll => {
  return { 
    type: REMOVE_LIKE, 
    payload: poll 
  }
}

export const addDislike = poll => {
  return {
    type: ADD_DISLIKE, 
    payload: poll 
  }
}

export const removeDislike = poll => {
  return { 
    type: REMOVE_DISLIKE, 
    payload: poll 
  }
}

export const addLikeAndRemoveDislike = poll => {
  return {
    type: ADD_LIKE_AND_REMOVE_DISLIKE,
    payload: poll
  }
}

export const addDislikeAndRemoveLike = poll => {
  return {
    type: ADD_DISLIKE_AND_REMOVE_LIKE,
    payload: poll
  }
}

export const removeUserVotes = () => {
  return { type: REMOVE_USER_VOTES }
}

export const removeUserLikes = () => {
  return { type: REMOVE_USER_LIKES }
}

export const removeUserDislikes = () => {
  return { type: REMOVE_USER_DISLIKES }
}