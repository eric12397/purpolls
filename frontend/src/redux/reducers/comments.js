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

} from '../actions/types.js'

const initialState = {
  comments: [],
  commentsLikeCounters: {},
  commentsDislikeCounters: {},
  commentsLiked: {},
  commentsDisliked: {}
  
}

export default function(state = initialState, action) {
  switch(action.type) {

    case GET_COMMENTS:
      let comments = action.payload
      return {
        ...state,
        comments: comments
      }

    case SET_COMMENT_LIKES_AND_DISLIKES:
      return {
        ...state,
        commentsLikeCounters: action.payload.reduce((rest, comment) => {
          return {
            ...rest,
            [comment.id]: comment.likes
          }
        }, {}),
        
        commentsDislikeCounters: action.payload.reduce((rest, comment) => {
          return {
            ...rest, 
            [comment.id]: comment.dislikes
          }
        }, {}),
      }

    case ADD_COMMENT:
      return {
        ...state,
        comments: [ action.payload, ...state.comments ]
      }

    case GET_USER_COMMENT_LIKES:
      return {
        ...state, 
        commentsLiked: action.payload.reduce((rest, like) => {
          return {
            ...rest,
            [like.comment]: true 
          }
        }, {})
      }

    case GET_USER_COMMENT_DISLIKES:
      return { 
        ...state, 
        commentsDisliked: action.payload.reduce((rest, dislike) => {
          return {
            ...rest,
            [dislike.comment]: true 
          } 
        }, {})
      }

    case INCREMENT_COMMENT_LIKES:
      return {
        ...state,
        commentsLikeCounters: {
          ...state.commentsLikeCounters,
          [action.payload]: state.commentsLikeCounters[action.payload] + 1
        },
        commentsLiked: {
          ...state.commentsLiked,
          [action.payload]: true
        } 
      }

    case DECREMENT_COMMENT_LIKES:
      return {
        ...state,
        commentsLikeCounters: {
          ...state.commentsLikeCounters,
          [action.payload]: state.commentsLikeCounters[action.payload] - 1
        },
        commentsLiked: {
          ...state.commentsLiked,
          [action.payload]: undefined
        } 
      }

    case INCREMENT_COMMENT_DISLIKES:
      return {
        ...state,
        commentsDislikeCounters: {
          ...state.commentsDislikeCounters,
          [action.payload]: state.commentsDislikeCounters[action.payload] + 1
        },
        commentsDisliked: {
          ...state.commentsDisliked,
          [action.payload]: true
        } 
      }

    case DECREMENT_COMMENT_DISLIKES:
      return {
        ...state,
        commentsDislikeCounters: {
          ...state.commentsDislikeCounters,
          [action.payload]: state.commentsDislikeCounters[action.payload] - 1
        },
        commentsDisliked: {
          ...state.commentsDisliked,
          [action.payload]: undefined
        } 
      }

    default:
      return state;
  }
}