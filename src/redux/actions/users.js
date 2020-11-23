import axiosInstance from '../../axiosInstance'
import { GET_USERS, ADD_NEW_USER } from './types.js';

export const getUsers = () => dispatch => {
  axiosInstance.get('/users/')
    .then(response => dispatch(getUsersSuccess(response.data)))
    .catch(error => console.log(error))
}

const getUsersSuccess = users => {
  return {
    type: GET_USERS,
    payload: users
  }
}

export const addNewUser = newUser => {
  return {
    type: ADD_NEW_USER,
    payload: newUser
  }
}


