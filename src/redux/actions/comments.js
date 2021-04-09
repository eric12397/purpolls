import axiosInstance from '../../axiosInstance';
import { getErrors } from './errors';
import { 
  GET_COMMENTS, 
  ADD_COMMENT,
  GET_USER_COMMENT_LIKES,
  GET_USER_COMMENT_DISLIKES,
  ADD_LIKE,
  ADD_LIKE_AND_REMOVE_DISLIKE,
  REMOVE_LIKE,
  ADD_DISLIKE,
  ADD_DISLIKE_AND_REMOVE_LIKE,
  REMOVE_DISLIKE,
  ADD_LIKE_ON_COMMENT,
  ADD_LIKE_AND_REMOVE_DISLIKE_ON_COMMENT,
  REMOVE_LIKE_ON_COMMENT,
  ADD_DISLIKE_ON_COMMENT,
  ADD_DISLIKE_AND_REMOVE_LIKE_ON_COMMENT,
  REMOVE_DISLIKE_ON_COMMENT
} from "./types";

// thunks
export const getComments = pollId => (dispatch, getState) => {
  axiosInstance.get(`/polls/${pollId}/comments/`)
    .then(response => dispatch(getCommentsSuccess(response.data)))
    .catch(error => console.log(error))
}

export const addComment = (pollId, data) => (dispatch, getState) => {
  const { id: userId } = getState().auth.user
  axiosInstance.post(`/polls/${pollId}/comments/`, {
    poll_id: pollId,
    author: userId,
    comment_text: data.comment
  })
    .then(response => dispatch(addCommentSuccess(response.data)))
    .catch(error => dispatch(getErrors(error.response)))
}

export const getUserCommentLikes = pollId => (dispatch, getState) => {
  const { id: userId } = getState().auth.user
  axiosInstance.get(`/users/${userId}/polls/${pollId}/comment-likes/`)
    .then(response => dispatch(getUserCommentLikesSuccess(response.data)))
    .catch(error => console.log(error))
}

export const getUserCommentDislikes = pollId => (dispatch, getState) => {
  const { id: userId } = getState().auth.user
  axiosInstance.get(`/users/${userId}/polls/${pollId}/comment-dislikes/`)
    .then(response => dispatch(getUserCommentDislikesSuccess(response.data)))
    .catch(error => console.log(error))
}

export const toggleCommentLike = (commentId, pollId) => (dispatch, getState) => {
  const { id: userId } = getState().auth.user
  const { commentsLiked, commentsDisliked } = getState().comments
  
  const commentLiked = commentsLiked[commentId];
  const commentDisliked = commentsDisliked[commentId]
  
  if (commentLiked === undefined && commentDisliked === undefined) {
    axiosInstance.patch(`/comments/${commentId}/likes/`, {
      signal: ADD_LIKE,
      user_id: userId,
      poll_id: pollId
    })
      .then(response => dispatch(addLike(response.data)))
      .catch(error => console.log(error))
  }
  else if (commentLiked === true && commentDisliked === undefined) {
    axiosInstance.patch(`/comments/${commentId}/likes/`, {
      signal: REMOVE_LIKE,
      user_id: userId,
      poll_id: pollId
    })
      .then(response => dispatch(removeLike(response.data)))
      .catch(error => console.log(error))
  }
  else if (commentLiked === undefined && commentDisliked === true) {
    axiosInstance.patch(`/comments/${commentId}/likes/`, {
      signal: ADD_LIKE_AND_REMOVE_DISLIKE,
      user_id: userId,
      poll_id: pollId
    })
      .then(response => dispatch(addLikeAndRemoveDislike(response.data)))
      .catch(error => console.log(error))
  }
}

export const toggleCommentDislike = (commentId, pollId) => (dispatch, getState) => {
  const { id: userId } = getState().auth.user
  const { commentsLiked, commentsDisliked } = getState().comments

  const commentLiked = commentsLiked[commentId];
  const commentDisliked = commentsDisliked[commentId]

  if (commentLiked === undefined && commentDisliked === undefined) {
    axiosInstance.patch(`/comments/${commentId}/likes/`, {
      signal: ADD_DISLIKE,
      user_id: userId,
      poll_id: pollId
    })
      .then(response => dispatch(addDislike(response.data)))
      .catch(error => console.log(error))
  }
  else if (commentLiked === undefined && commentDisliked === true) {
    axiosInstance.patch(`/comments/${commentId}/likes/`, {
      signal: REMOVE_DISLIKE,
      user_id: userId,
      poll_id: pollId
    })
      .then(response => dispatch(removeDislike(response.data)))
      .catch(error => console.log(error))
  }
  else if (commentLiked === true && commentDisliked === undefined) {
    axiosInstance.patch(`/comments/${commentId}/likes/`, {
      signal: ADD_DISLIKE_AND_REMOVE_LIKE,
      user_id: userId,
      poll_id: pollId
    })
      .then(response => dispatch(addDislikeAndRemoveLike(response.data)))
      .catch(error => console.log(error))
  }
}

// action creators
const getCommentsSuccess = comments => {
  return {
    type: GET_COMMENTS,
    payload: comments
  }
}

const addCommentSuccess = newComment => {
  return {
    type: ADD_COMMENT,
    payload: newComment
  }
}

const getUserCommentLikesSuccess = userCommentLikes => {
  return {
    type: GET_USER_COMMENT_LIKES,
    payload: userCommentLikes
  }
}

const getUserCommentDislikesSuccess = userCommentDislikes => {
  return {
    type: GET_USER_COMMENT_DISLIKES,
    payload: userCommentDislikes
  }
}

const addLike = comment => {
  return {
    type: ADD_LIKE_ON_COMMENT,
    payload: comment 
  }
}

const removeLike = comment => {
  return { 
    type: REMOVE_LIKE_ON_COMMENT, 
    payload: comment 
  }
}

const addDislike = comment => {
  return {
    type: ADD_DISLIKE_ON_COMMENT, 
    payload: comment 
  }
}

const removeDislike = comment => {
  return { 
    type: REMOVE_DISLIKE_ON_COMMENT, 
    payload: comment 
  }
}

const addLikeAndRemoveDislike = comment => {
  return {
    type: ADD_LIKE_AND_REMOVE_DISLIKE_ON_COMMENT,
    payload: comment
  }
}

const addDislikeAndRemoveLike = comment => {
  return {
    type: ADD_DISLIKE_AND_REMOVE_LIKE_ON_COMMENT,
    payload: comment
  }
}