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
  DECREMENT_POLL_LIKES,
  INCREMENT_POLL_LIKES,
  INCREMENT_POLL_DISLIKES,
  DECREMENT_POLL_DISLIKES
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

    case INCREMENT_POLL_LIKES:
      return {
        ...state,
        polls: state.polls.map(poll => poll.id === action.payload.poll.id ? action.payload.poll : poll),
        pollsLiked: {
          ...state.pollsLiked,
          [action.payload.poll.id]: true
        }
      }

    case DECREMENT_POLL_LIKES:
      return {
        ...state, 
        polls: state.polls.map(poll => poll.id === action.payload.poll.id ? action.payload.poll : poll),
        pollsLiked: {
          ...state.pollsLiked,
          [action.payload.poll.id]: undefined
        }
      }

    case INCREMENT_POLL_DISLIKES:
      return {
        ...state, 
        polls: state.polls.map(poll => poll.id === action.payload.poll.id ? action.payload.poll : poll),
        pollsDisliked: {
          ...state.pollsDisliked,
          [action.payload.poll.id]: true
        }
      }

    case DECREMENT_POLL_DISLIKES:
      return {
        ...state,
        polls: state.polls.map(poll => poll.id === action.payload.poll.id ? action.payload.poll : poll),
        pollsDisliked: {
          ...state.pollsDisliked,
          [action.payload.poll.id]: undefined
        }
      }

    default:
      return state;
  }
}