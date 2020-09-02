import axiosInstance from '../../axiosInstance'
import { GET_USERS, ADD_NEW_USER } from './types.js';

export const getUsers = () => dispatch => {
  axiosInstance.get('/users/')
    .then(response => {
      dispatch({
        type: GET_USERS,
        payload: response.data
      })
    }).catch(error => console.log(error))
}

export const addNewUser = newUser => dispatch => {
  dispatch({
    type: ADD_NEW_USER,
    payload: newUser 
  })
}
