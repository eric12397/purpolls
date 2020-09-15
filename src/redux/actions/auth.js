import axiosInstance from '../../axiosInstance';
import axios from 'axios'
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
  REMOVE_USER_DISLIKES,
  RECOVER_USERNAME,
  PASSWORD_RESET_REQUESTED,
  PASSWORD_RESET_CONFIRMED,
  ACCOUNT_ACTIVATED
} from './types.js'

export const loadCurrentUser = () => (dispatch, getState) => {
  axiosInstance.get('/auth/current_user/')
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
  if (data.password === data.confirmed_password) {
    
    axiosInstance.post('/auth/users/', {
    username: data.username,
    email: data.email,
    password: data.password,
    confirmed_password: data.confirmed_password
  })
    .then(response => {
      dispatch(addNewUser(response.data))
      dispatch(createMessage({ activationEmailSent: 'A link has been sent to your email to activate your new account!' }))
    })
    .catch(error => dispatch(getErrors(error.response)))
  } else {
    dispatch(createMessage({ passwordsMustMatch: "The two password fields didn't match." }))
  }
  
}

export const activateAccount = (uid, token, history) => dispatch => {
  axiosInstance.post('/auth/users/activation/', {
    uid,
    token
  })
    .then(response => {
      history.push('/login')
      dispatch({ type: ACCOUNT_ACTIVATED })
      dispatch(createMessage({ accountActivated: 'Your account has now been activated. Log in with your new credentials.'}))
    })
    .catch(error => console.log(error.response))
}

export const handleLogin = (data, history) => (dispatch, getState) => {
  axiosInstance.post('/auth/token/obtain/', {
    email: data.email,
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

export const requestPasswordReset = (email) => dispatch => {
  axiosInstance.post('/auth/users/reset_password/', {
      email
    })
    .then(response => {
      dispatch(createMessage({ passwordResetRequested: 'An email request has been sent to reset your password! '}))
      dispatch({ type: PASSWORD_RESET_REQUESTED })
    })

    .catch(error => dispatch(getErrors(error.response)))
}

export const confirmPasswordReset = (uid, token, new_password, re_new_password, history) => dispatch => {
  axiosInstance.post('/auth/users/reset_password_confirm/', {
      uid,
      token,
      new_password,
      re_new_password
    })
    .then(response => {
      history.push('/login')
      dispatch(createMessage({ passwordResetConfirmed: 'You can now log in with your new password!'}))
      dispatch({ type: PASSWORD_RESET_CONFIRMED })
    })

    .catch(error => dispatch(getErrors(error.response))) 
}