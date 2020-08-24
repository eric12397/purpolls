import axios from "axios";
import { GET_USERS, ADD_NEW_USER } from './types.js';

export const getUsers = () => dispatch => {
  axios.get('http://localhost:8000/api/users/')
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
