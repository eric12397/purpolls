import {
  USER_AUTHENTICATED,
  HANDLE_LOGIN,
  HANDLE_LOGOUT,

} from '../actions/types.js'


const initialState = {
  user: '',
  isAuthenticated: localStorage.getItem('accessToken') ? true : false
}

export default function(state = initialState, action) {
  switch(action.type) {
    case USER_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload
      }

    case HANDLE_LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload
      }

    case HANDLE_LOGOUT:
      return {
        ...state, 
        isAuthenticated: false, 
        user: ''
      }

  default:
    return state;
  }


}