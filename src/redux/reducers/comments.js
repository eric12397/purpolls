import { 
  GET_COMMENTS, 
  ADD_COMMENT,
  GET_USER_COMMENT_LIKES,
  GET_USER_COMMENT_DISLIKES,
  ADD_LIKE_ON_COMMENT,
  ADD_LIKE_AND_REMOVE_DISLIKE_ON_COMMENT,
  REMOVE_LIKE_ON_COMMENT,
  ADD_DISLIKE_ON_COMMENT,
  ADD_DISLIKE_AND_REMOVE_LIKE_ON_COMMENT,
  REMOVE_DISLIKE_ON_COMMENT
} from '../actions/types.js'

const initialState = {
  comments: [],
  commentsLiked: {},
  commentsDisliked: {}
}

export default function(state = initialState, action) {
  switch(action.type) {

    case GET_COMMENTS:
      return {
        ...state,
        comments: action.payload
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

    case ADD_LIKE_ON_COMMENT:
      return {
        ...state,
        comments: state.comments.map(comment => comment.id === action.payload.comment.id ? action.payload.comment : comment),
        commentsLiked: {
          ...state.commentsLiked,
          [action.payload.comment.id]: true
        }
      }

    case REMOVE_LIKE_ON_COMMENT:
      return {
        ...state, 
        comments: state.comments.map(comment => comment.id === action.payload.comment.id ? action.payload.comment : comment),
        commentsLiked: {
          ...state.commentsLiked,
          [action.payload.comment.id]: undefined
        }
      }

    case ADD_DISLIKE_ON_COMMENT:
      return {
        ...state, 
        comments: state.comments.map(comment => comment.id === action.payload.comment.id ? action.payload.comment : comment),
        commentsDisliked: {
          ...state.commentsDisliked,
          [action.payload.comment.id]: true
        }
      }

    case REMOVE_DISLIKE_ON_COMMENT:
      return {
        ...state,
        comments: state.comments.map(comment => comment.id === action.payload.comment.id ? action.payload.comment : comment),
        commentsDisliked: {
          ...state.commentsDisliked,
          [action.payload.comment.id]: undefined
        }
      }

    case ADD_LIKE_AND_REMOVE_DISLIKE_ON_COMMENT:
      return {
        ...state,
        comments: state.comments.map(comment => comment.id === action.payload.comment.id ? action.payload.comment : comment),
        commentsLiked: {
          ...state.commentsLiked,
          [action.payload.comment.id]: true
        },
        commentsDisliked: {
          ...state.commentsDisliked,
          [action.payload.comment.id]: undefined
        }
      }

    case ADD_DISLIKE_AND_REMOVE_LIKE_ON_COMMENT:
      return {
        ...state,
        comments: state.comments.map(comment => comment.id === action.payload.comment.id ? action.payload.comment : comment),
        commentsLiked: {
          ...state.commentsLiked,
          [action.payload.comment.id]: undefined
        },
        commentsDisliked: {
          ...state.commentsDisliked,
          [action.payload.comment.id]: true
        }
      }

    default:
      return state;
  }
}