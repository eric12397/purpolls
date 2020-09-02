import axiosInstance from '../../axiosInstance';
import { getErrors } from './errors';
import { 
  GET_COMMENTS, 
  ADD_COMMENT,
  GET_USER_COMMENT_LIKES,
  GET_USER_COMMENT_DISLIKES,
  INCREMENT_COMMENT_LIKES,
  DECREMENT_COMMENT_LIKES,
  INCREMENT_COMMENT_DISLIKES,
  DECREMENT_COMMENT_DISLIKES,
  SET_COMMENT_LIKES_AND_DISLIKES
} from "./types";

export const getComments = pollId => (dispatch, getState) => {
  axiosInstance.get(`/polls/${pollId}/comments/`)
    .then(response => {
      dispatch({
        type: GET_COMMENTS,
        payload: response.data
      })
      const { comments } = getState().comments
      dispatch(setCommentLikesAndDislikes(comments))
    })

    .catch(error => console.log(error))
}

export const addComment = (pollId, data) => (dispatch, getState) => {
  const { id: userId } = getState().auth.user
  axiosInstance.post(`/polls/${pollId}/comments/`, {
      poll_id: pollId,
      author: userId,
      comment_text: data.comment
    })
    .then(response => {
      dispatch({
        type: ADD_COMMENT,
        payload: response.data
      })
      const { comments } = getState().comments
      dispatch(setCommentLikesAndDislikes(comments))
    })
    .catch(error => dispatch(getErrors(error.response)))
}

export const getUserCommentLikes = pollId => (dispatch, getState) => {
  const { id: userId } = getState().auth.user
  axiosInstance.get(`/users/${userId}/polls/${pollId}/comment-likes/`)
    .then(response => {
      dispatch({
        type: GET_USER_COMMENT_LIKES,
        payload: response.data
      })
    })
    .catch(error => console.log(error))
}

export const getUserCommentDislikes = pollId => (dispatch, getState) => {
  const { id: userId } = getState().auth.user
  axiosInstance.get(`/users/${userId}/polls/${pollId}/comment-dislikes/`)
    .then(response => {
      dispatch({
        type: GET_USER_COMMENT_DISLIKES,
        payload: response.data
      })
    })
    .catch(error => console.log(error))
}

export const toggleCommentLike = (commentId, pollId) => (dispatch, getState) => {
  const { id: userId } = getState().auth.user
  const { 
    commentsLiked, 
    commentsDisliked, 
    commentsLikeCounters, 
    commentsDislikeCounters 
  } = getState().comments
  
  const commentLiked = commentsLiked[commentId];
  const commentDisliked = commentsDisliked[commentId]
  
  if (commentLiked === undefined && commentDisliked === undefined) {
    axiosInstance.patch(`/comments/${commentId}/likes/`, {
      signal: 'add like',
      user_id: userId,
      poll_id: pollId,
      likes: commentsLikeCounters[commentId] + 1
    })
      .then(response => console.log(response.data))

    dispatch({ 
      type: INCREMENT_COMMENT_LIKES,
      payload: commentId
    })
  }

  if (commentLiked === true && commentDisliked === undefined) {
    axiosInstance.patch(`/comments/${commentId}/likes/`, {
      signal: 'remove like',
      user_id: userId,
      poll_id: pollId,
      likes: commentsLikeCounters[commentId] - 1
    })
      .then(response => console.log(response.data))

    dispatch({
      type: DECREMENT_COMMENT_LIKES,
      payload: commentId
    })
  }

  if (commentLiked === undefined && commentDisliked === true) {
    axiosInstance.patch(`/comments/${commentId}/likes/`, {
      signal: 'add like, remove dislike',
      user_id: userId,
      poll_id: pollId,
      likes: commentsLikeCounters[commentId] + 1,
      dislikes: commentsDislikeCounters[commentId] - 1
    })
      .then(response => console.log(response.data))

    dispatch({
      type: INCREMENT_COMMENT_LIKES,
      payload: commentId
    })
    dispatch({
      type: DECREMENT_COMMENT_DISLIKES,
      payload: commentId
    })
  }
}

export const toggleCommentDislike = (commentId, pollId) => (dispatch, getState) => {
  const { id: userId } = getState().auth.user
  const { 
    commentsLiked, 
    commentsDisliked, 
    commentsLikeCounters, 
    commentsDislikeCounters 
  } = getState().comments

  const commentLiked = commentsLiked[commentId];
  const commentDisliked = commentsDisliked[commentId]

  if (commentLiked === undefined && commentDisliked === undefined) {
    axiosInstance.patch(`/comments/${commentId}/dislikes/`, {
      signal: 'add dislike',
      user_id: userId,
      poll_id: pollId,
      dislikes: commentsDislikeCounters[commentId] + 1,
    })
      .then(response => console.log(response.data))

    dispatch({
      type: INCREMENT_COMMENT_DISLIKES,
      payload: commentId
    })
  }

  if (commentLiked === undefined && commentDisliked === true) {
    axiosInstance.patch(`/comments/${commentId}/dislikes/`, {
      signal: 'remove dislike',
      user_id: userId,
      poll_id: pollId,
      dislikes: commentsDislikeCounters[commentId] - 1,
    })
      .then(response => console.log(response.data))

    dispatch({
      type: DECREMENT_COMMENT_DISLIKES,
      payload: commentId
    })
  }

  if (commentLiked === true && commentDisliked === undefined) {
    axiosInstance.patch(`/comments/${commentId}/dislikes/`, {
      signal: 'add dislike, remove like',
      user_id: userId,
      poll_id: pollId,
      dislikes: commentsDislikeCounters[commentId] + 1, 
      likes: commentsLikeCounters[commentId] - 1
    })
      .then(response => console.log(response.data))

    dispatch({
      type: INCREMENT_COMMENT_DISLIKES,
      payload: commentId
    })
    dispatch({
      type: DECREMENT_COMMENT_LIKES,
      payload: commentId
    })
  }
}


const setCommentLikesAndDislikes = comments => {
  return { 
    type: SET_COMMENT_LIKES_AND_DISLIKES,
    payload: comments 
  }
}
