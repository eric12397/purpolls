import { GET_ERRORS } from './types'

export const getErrors = errors => {
  return {
    type: GET_ERRORS,
    payload: errors
  }
}