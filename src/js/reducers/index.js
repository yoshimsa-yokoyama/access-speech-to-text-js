import { combineReducers } from 'redux'
import counter from './CounterReducer'
import audio from './AudioReducer'

const reducers = combineReducers({
  counter,
  audio
})

export default reducers
