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
  GET_ERRORS,
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
    .then(response => {
      dispatch(getPollsSuccess(response.data))
      const { polls } = getState().polls
      dispatch(setPollLikesAndDislikes(polls))
    })
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
  const { 
    pollsLiked, 
    pollsDisliked, 
    pollsLikeCounters, 
    pollsDislikeCounters 
  } = getState().polls

  const pollLiked = pollsLiked[pollId];
  const pollDisliked = pollsDisliked[pollId]

  if (pollLiked === undefined && pollDisliked === undefined) {
    dispatch(incrementPollLikes(pollId))
    axiosInstance.patch(`/polls/${pollId}/likes/`, {
      signal: ADD_LIKE,
      user_id: userId,
      likes: pollsLikeCounters[pollId] + 1, 
    })
      .then(response => console.log(response.data))
      .catch(error => console.log(error))
  }

  else if (pollLiked === true && pollDisliked === undefined) {
    dispatch(decrementPollLikes(pollId))
    axiosInstance.patch(`/polls/${pollId}/likes/`, {
      signal: REMOVE_LIKE,
      user_id: userId,
      likes: pollsLikeCounters[pollId] - 1,
    })
      .then(response => console.log(response.data))
      .catch(error => console.log(error))
  } 

  else if (pollLiked === undefined && pollDisliked === true) {
    dispatch(incrementPollLikes(pollId));
    dispatch(decrementPollDislikes(pollId));
    axiosInstance.patch(`/polls/${pollId}/likes/`, {
      signal: ADD_LIKE_AND_REMOVE_DISLIKE,
      user_id: userId,
      likes: pollsLikeCounters[pollId] + 1, 
      dislikes: pollsDislikeCounters[pollId] - 1, 
    })
      .then(response => console.log(response.data))
      .catch(error => console.log(error))
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
    dispatch(incrementPollDislikes(pollId));

    axiosInstance.patch(`/polls/${pollId}/dislikes/`, {
      signal: ADD_DISLIKE,
      user_id: userId,
      dislikes: pollsDislikeCounters[pollId] + 1
    })
      .then(response => console.log(response.data))
      .catch(error => console.log(error))
  }

  else if (pollLiked === undefined && pollDisliked === true) {
    dispatch(decrementPollDislikes(pollId));

    axiosInstance.patch(`/polls/${pollId}/dislikes/`, {
      signal: REMOVE_DISLIKE,
      user_id: userId,
      dislikes: pollsDislikeCounters[pollId] - 1
    })
      .then(response => console.log(response.data))
      .catch(error => console.log(error))
  }

  else if (pollLiked === true && pollDisliked === undefined) {
    dispatch(decrementPollLikes(pollId));

    dispatch(incrementPollDislikes(pollId));

    axiosInstance.patch(`/polls/${pollId}/dislikes/`, {
      signal: ADD_DISLIKE_AND_REMOVE_LIKE,
      user_id: userId,
      dislikes: pollsDislikeCounters[pollId] + 1,
      likes: pollsLikeCounters[pollId] - 1,
    })
      .then(response => console.log(response.data))
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

const setPollLikesAndDislikes = polls => {
  return { 
    type: SET_POLL_LIKES_AND_DISLIKES,
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

const incrementPollLikes = pollId => {
  return {
    type: INCREMENT_POLL_LIKES, 
    payload: pollId 
  }
}

const decrementPollLikes = pollId => {
  return { 
    type: DECREMENT_POLL_LIKES, 
    payload: pollId 
  }
}

const incrementPollDislikes = pollId => {
  return {
    type: INCREMENT_POLL_DISLIKES, 
    payload: pollId 
  }
}

const decrementPollDislikes = pollId => {
  return { 
    type: DECREMENT_POLL_DISLIKES, 
    payload: pollId 
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