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
  SET_COMMENT_LIKES_AND_DISLIKES,
  ADD_LIKE,
  ADD_LIKE_AND_REMOVE_DISLIKE,
  REMOVE_LIKE,
  ADD_DISLIKE,
  ADD_DISLIKE_AND_REMOVE_LIKE,
  REMOVE_DISLIKE
} from "./types";

// thunks
export const getComments = pollId => (dispatch, getState) => {
  axiosInstance.get(`/polls/${pollId}/comments/`)
    .then(response => {
      dispatch(getCommentsSuccess(response.data))
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
      dispatch(addCommentSuccess(response.data))
      const { comments } = getState().comments
      dispatch(setCommentLikesAndDislikes(comments))
    })
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
  const { 
    commentsLiked, 
    commentsDisliked, 
    commentsLikeCounters, 
    commentsDislikeCounters 
  } = getState().comments
  
  const commentLiked = commentsLiked[commentId];
  const commentDisliked = commentsDisliked[commentId]
  
  if (commentLiked === undefined && commentDisliked === undefined) {
    dispatch(incrementCommentLikes(commentId))
    axiosInstance.patch(`/comments/${commentId}/likes/`, {
      signal: ADD_LIKE,
      user_id: userId,
      poll_id: pollId,
      likes: commentsLikeCounters[commentId] + 1
    })
      .then(response => console.log(response.data))
      .catch(error => console.log(error))
  }
  else if (commentLiked === true && commentDisliked === undefined) {
    dispatch(decrementCommentLikes(commentId))
    axiosInstance.patch(`/comments/${commentId}/likes/`, {
      signal: REMOVE_LIKE,
      user_id: userId,
      poll_id: pollId,
      likes: commentsLikeCounters[commentId] - 1
    })
      .then(response => console.log(response.data))
      .catch(error => console.log(error))
  }
  else if (commentLiked === undefined && commentDisliked === true) {
    dispatch(incrementCommentLikes(commentId));
    dispatch(decrementCommentDislikes(commentId));
    axiosInstance.patch(`/comments/${commentId}/likes/`, {
      signal: ADD_LIKE_AND_REMOVE_DISLIKE,
      user_id: userId,
      poll_id: pollId,
      likes: commentsLikeCounters[commentId] + 1,
      dislikes: commentsDislikeCounters[commentId] - 1
    })
      .then(response => console.log(response.data))
      .catch(error => console.log(error))
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
    dispatch(incrementCommentDislikes(commentId))
    axiosInstance.patch(`/comments/${commentId}/dislikes/`, {
      signal: ADD_DISLIKE,
      user_id: userId,
      poll_id: pollId,
      dislikes: commentsDislikeCounters[commentId] + 1,
    })
      .then(response => console.log(response.data))
      .catch(error => console.log(error))
  }
  else if (commentLiked === undefined && commentDisliked === true) {
    dispatch(decrementCommentDislikes(commentId))
    axiosInstance.patch(`/comments/${commentId}/dislikes/`, {
      signal: REMOVE_DISLIKE,
      user_id: userId,
      poll_id: pollId,
      dislikes: commentsDislikeCounters[commentId] - 1,
    })
      .then(response => console.log(response.data))
      .catch(error => console.log(error))
  }
  else if (commentLiked === true && commentDisliked === undefined) {
    dispatch(incrementCommentDislikes(commentId));
    dispatch(decrementCommentLikes(commentId));
    axiosInstance.patch(`/comments/${commentId}/dislikes/`, {
      signal: ADD_DISLIKE_AND_REMOVE_LIKE,
      user_id: userId,
      poll_id: pollId,
      dislikes: commentsDislikeCounters[commentId] + 1, 
      likes: commentsLikeCounters[commentId] - 1
    })
      .then(response => console.log(response.data))
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

const setCommentLikesAndDislikes = comments => {
  return { 
    type: SET_COMMENT_LIKES_AND_DISLIKES,
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

const incrementCommentLikes = commentId => {
  return {
    type: INCREMENT_COMMENT_LIKES, 
    payload: commentId 
  }
}

const decrementCommentLikes = commentId => {
  return { 
    type: DECREMENT_COMMENT_LIKES, 
    payload: commentId 
  }
}

const incrementCommentDislikes = commentId => {
  return {
    type: INCREMENT_COMMENT_DISLIKES, 
    payload: commentId 
  }
}

const decrementCommentDislikes = commentId => {
  return { 
    type: DECREMENT_COMMENT_DISLIKES, 
    payload: commentId 
  }
}
