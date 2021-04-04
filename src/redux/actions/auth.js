import axiosInstance from '../../axiosInstance';
import { getUserVotes, getUserLikes, getUserDislikes, removeUserVotes, removeUserLikes, removeUserDislikes } from './polls';
import { getErrors } from './errors';
import { createMessage } from './messages';
import { addNewUser } from './users';
import { 
  USER_AUTHENTICATED,
  HANDLE_LOGOUT,
  PASSWORD_RESET_REQUESTED,
  PASSWORD_RESET_CONFIRMED,
  REGISTER_ACCOUNT_PENDING,
  REGISTER_ACCOUNT_SUCCESS,
  REGISTER_ACCOUNT_FAILURE,
  ACTIVATE_ACCOUNT_PENDING,
  ACTIVATE_ACCOUNT_SUCCESS
} from './types.js'

// thunks
export const loadCurrentUser = () => (dispatch, getState) => {
  axiosInstance.get('/auth/current_user/')
    .then(response => {
      dispatch(userAuthSuccess(response.data))
      const { id } = getState().auth.user
      dispatch(getUserVotes(id))
      dispatch(getUserLikes(id))
      dispatch(getUserDislikes(id))
    }).catch(error => console.log(error))
}

export const handleRegistration = (data, history) => dispatch => {
  if (data.password &&
      data.confirmed_password &&
      data.password === data.confirmed_password) {
    dispatch(registerAccountPending())
    axiosInstance.post('/auth/users/', {
      username: data.username,
      email: data.email,
      password: data.password,
      confirmed_password: data.confirmed_password
    })
    .then(response => {
      dispatch(registerAccountSuccess())
      dispatch(addNewUser(response.data))
      dispatch(createMessage({ activationEmailSent: 'A link has been sent to your email to activate your new account!' }))
    })
    .catch(error => { 
      dispatch(registerAccountFailure())
      dispatch(getErrors(error.response))
    })
  } else {
    dispatch(createMessage({ passwordsMustMatch: "The two password fields didn't match." }))
  }
}

export const activateAccount = (uid, token, history) => dispatch => {
  dispatch(activateAccountPending())
  axiosInstance.post('/auth/users/activation/', {
    uid,
    token
  })
    .then(response => {
      history.push('/login')
      dispatch(activateAccountSuccess())
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
      dispatch(userAuthSuccess(response.data))
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
  dispatch(handleLogoutSuccess())
  dispatch(removeUserVotes())
  dispatch(removeUserLikes())
  dispatch(removeUserDislikes())
}

export const requestPasswordReset = (email) => dispatch => {
  axiosInstance.post('/auth/users/reset_password/', {
      email
    })
    .then(response => {
      dispatch(passwordResetRequested())
      dispatch(createMessage({ passwordResetRequested: 'An email request has been sent to reset your password! '}))
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
      dispatch(passwordResetConfirmed())
      dispatch(createMessage({ passwordResetConfirmed: 'You can now log in with your new password!' }))
    })
    .catch(error => dispatch(getErrors(error.response))) 
}

// action creators
const userAuthSuccess = user => {
  return {
    type: USER_AUTHENTICATED,
    payload: user
  }
}

const registerAccountPending = () => {
  return { type: REGISTER_ACCOUNT_PENDING }
}

const registerAccountSuccess = () => {
  return { type: REGISTER_ACCOUNT_SUCCESS }
}

const registerAccountFailure = () => {
  return { type: REGISTER_ACCOUNT_FAILURE }
}

const activateAccountPending = () => {
  return { type: ACTIVATE_ACCOUNT_PENDING }
}

const activateAccountSuccess = () => {
  return { type: ACTIVATE_ACCOUNT_SUCCESS }
}

const passwordResetRequested = () => {
  return { type: PASSWORD_RESET_REQUESTED }
}

const passwordResetConfirmed = () => {
  return { type: PASSWORD_RESET_CONFIRMED }
}

const handleLogoutSuccess = () => {
  return { type: HANDLE_LOGOUT }
}