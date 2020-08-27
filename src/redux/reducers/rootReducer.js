import { combineReducers } from 'redux';
import polls from './polls';
import comments from './comments';
import auth from './auth';
import users from './users';
import messages from './messages';
import errors from './errors'

export default combineReducers({ 
  polls,
  comments,
  auth, 
  users,
  messages,
  errors
  
})