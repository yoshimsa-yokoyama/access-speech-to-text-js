import { handleActions } from 'redux-actions'
import { increment, decrement } from '../actions'

const initialState = {
  count: 0
}

const counter = handleActions({
  [increment]: state => ({
    ...state,
    count: state.count + 1
  }),
  [decrement]: state => ({
    ...state,
    count: state.count - 1
  })
}, initialState)

export default counter
