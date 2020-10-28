import {
  USER_AUTHENTICATED,
  HANDLE_LOGIN,
  HANDLE_LOGOUT,
  REGISTER_ACCOUNT_PENDING,
  REGISTER_ACCOUNT_SUCCESS,
  REGISTER_ACCOUNT_FAILURE,
  ACTIVATE_ACCOUNT_PENDING,
  ACTIVATE_ACCOUNT_SUCCESS

} from '../actions/types.js'


const initialState = {
  user: '',
  isAuthenticated: localStorage.getItem('accessToken') ? true : false,
  isLoading: null
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

    case REGISTER_ACCOUNT_PENDING:
      return {
        ...state,
        isLoading: true
      }

    case REGISTER_ACCOUNT_SUCCESS:
      return {
        ...state,
        isLoading: false
      }

    case REGISTER_ACCOUNT_FAILURE:
      return {
        ...state,
        isLoading: false
      }

    case ACTIVATE_ACCOUNT_PENDING:
      return {
        ...state,
        isLoading: true
      }

    case ACTIVATE_ACCOUNT_SUCCESS:
      return {
        ...state,
        isLoading: false
      }

  default:
    return state;
  }


}