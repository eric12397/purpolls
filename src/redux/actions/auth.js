import axiosInstance from '../../axiosInstance';
import { getUserVotes, getUserLikes, getUserDislikes } from './polls';
import { getErrors } from './errors';
import { createMessage } from './messages';
import { addNewUser } from './users';
import { 
  USER_AUTHENTICATED,
  HANDLE_LOGIN,
  HANDLE_LOGOUT,
  REMOVE_USER_VOTES,
  REMOVE_USER_LIKES,
  REMOVE_USER_DISLIKES
} from './types.js'

export const verifyCurrentUser = () => (dispatch, getState) => {
  axiosInstance.get('/current_user/')
    .then(response => {
      console.log(response)
      dispatch({
        type: USER_AUTHENTICATED,
        payload: response.data
      })

      const { id } = getState().auth.user
      dispatch(getUserVotes(id))
      dispatch(getUserLikes(id))
      dispatch(getUserDislikes(id))
      
    }).catch(error => console.log(error))
}

export const handleRegistration = (data, history) => dispatch => {
  axiosInstance.post('/register/', {
    username: data.username,
    email: data.email,
    password: data.password,
  })
    .then(response => {
      dispatch(addNewUser(response.data))
      dispatch(createMessage({ registerSuccess: 'Your account has been created successfully! Log in now to start polling!'}))
      history.push('/login')
    })
    .catch(error => dispatch(getErrors(error.response)))
}

export const handleLogin = (data, history) => (dispatch, getState) => {
  axiosInstance.post('/token/obtain/', {
    username: data.username,
    password: data.password
  })
    .then(response => {
      dispatch({
        type: HANDLE_LOGIN,
        payload: response.data
      })

      const { id, username } = getState().auth.user
      dispatch(createMessage({ loginSuccess: `Welcome ${username}! You have successfully logged in.`}))
      dispatch(getUserVotes(id))
      dispatch(getUserLikes(id))
      dispatch(getUserDislikes(id))

      axiosInstance.defaults.headers['Authorization'] = "Bearer " + response.data.access;
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      history.push('/')

    }).catch(error => dispatch(getErrors(error.response)))
}

export const handleLogout = () => dispatch => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  dispatch({ type: HANDLE_LOGOUT })
  dispatch({ type: REMOVE_USER_VOTES })
  dispatch({ type: REMOVE_USER_LIKES })
  dispatch({ type: REMOVE_USER_DISLIKES })
}