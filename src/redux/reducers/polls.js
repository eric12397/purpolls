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
  REMOVE_LIKE,
  ADD_DISLIKE,
  REMOVE_DISLIKE,
  ADD_LIKE_AND_REMOVE_DISLIKE,
  ADD_DISLIKE_AND_REMOVE_LIKE
} from '../actions/types.js'

const initialState = {
  polls: [],
  pollsLiked: {},
  pollsDisliked: {},
  userVotes: []
}

// poll reducer
export default function(state = initialState, action) {
  switch(action.type) {
    case GET_POLLS: 
      return {
        ...state,
        polls: action.payload,
      }

    case GET_USER_VOTES: 
      return {
        ...state,
        userVotes: action.payload
      }

    case GET_USER_LIKES:
      return {
        ...state, 
        pollsLiked: action.payload.reduce((rest, like) => {
          return {
            ...rest,
            [like.poll]: true
          }
        }, {})
      }

    case GET_USER_DISLIKES:
      return {
        ...state, 
        pollsDisliked: action.payload.reduce((rest, dislike) => {
          return {
            ...rest,
            [dislike.poll]: true
          }
        }, {})
      }

    case REMOVE_USER_VOTES:
      return {
        ...state,
        userVotes: []
      }

    case REMOVE_USER_LIKES:
      return {
        ...state,
        pollsLiked: {}
      }

    case REMOVE_USER_DISLIKES:
      return {
        ...state,
        pollsDisliked: {}
      }

    case DELETE_POLL:
      return {
        ...state,
        polls: [ ...state.polls.filter(poll => poll.id !== action.payload) ]
      }

    case ADD_POLL:
      return {
        ...state,
        polls: [ action.payload, ...state.polls ]
      }

    case HANDLE_VOTE:
      return {
        ...state,
        polls: state.polls.map(poll => poll.id === action.payload.poll.id ? action.payload.poll : poll),
        userVotes: [ action.payload.vote, ...state.userVotes ]
      }

    case ADD_LIKE:
      return {
        ...state,
        polls: state.polls.map(poll => poll.id === action.payload.poll.id ? action.payload.poll : poll),
        pollsLiked: {
          ...state.pollsLiked,
          [action.payload.poll.id]: true
        }
      }

    case REMOVE_LIKE:
      return {
        ...state, 
        polls: state.polls.map(poll => poll.id === action.payload.poll.id ? action.payload.poll : poll),
        pollsLiked: {
          ...state.pollsLiked,
          [action.payload.poll.id]: undefined
        }
      }

    case ADD_DISLIKE:
      return {
        ...state, 
        polls: state.polls.map(poll => poll.id === action.payload.poll.id ? action.payload.poll : poll),
        pollsDisliked: {
          ...state.pollsDisliked,
          [action.payload.poll.id]: true
        }
      }

    case REMOVE_DISLIKE:
      return {
        ...state,
        polls: state.polls.map(poll => poll.id === action.payload.poll.id ? action.payload.poll : poll),
        pollsDisliked: {
          ...state.pollsDisliked,
          [action.payload.poll.id]: undefined
        }
      }

    case ADD_LIKE_AND_REMOVE_DISLIKE:
      return {
        ...state,
        polls: state.polls.map(poll => poll.id === action.payload.poll.id ? action.payload.poll : poll),
        pollsLiked: {
          ...state.pollsLiked,
          [action.payload.poll.id]: true
        },
        pollsDisliked: {
          ...state.pollsDisliked,
          [action.payload.poll.id]: undefined
        }
      }

    case ADD_DISLIKE_AND_REMOVE_LIKE:
      return {
        ...state,
        polls: state.polls.map(poll => poll.id === action.payload.poll.id ? action.payload.poll : poll),
        pollsLiked: {
          ...state.pollsLiked,
          [action.payload.poll.id]: undefined
        },
        pollsDisliked: {
          ...state.pollsDisliked,
          [action.payload.poll.id]: true
        }
      }

    default:
      return state;
  }
}