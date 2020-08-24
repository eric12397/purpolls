import { GET_USERS, ADD_NEW_USER } from '../actions/types.js';

const initialState = {
  users: []
}

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_USERS:
      return {
        ...state,
        users: action.payload
      }

    case ADD_NEW_USER:
      return {
        ...state,
        users: [ action.payload, ...state.users ]
      }

  default: 
    return state
  }
} 