import { handleActions } from 'redux-actions'
import { startRecordProcessSuccess, startRecordProcessFail, stopRecordProcessSuccess, voiceProcessSuccess, voiceProcessFail } from '../actions'

export const getAudio = state => state.audio

const initialState = {
  isRecording: false,
  sourceBase64: '',
  resultText: '',
  resultError: null
}

const audio = handleActions({
  [startRecordProcessSuccess]: state => ({
    ...state,
    isRecording: true,
    resultError: initialState.resultError
  }),
  [startRecordProcessFail]: state => ({
    ...state,
    isRecording: initialState.isRecording,
    resultError: initialState.resultError
  }),
  [stopRecordProcessSuccess]: (state, action) => ({
    ...state,
    sourceBase64: action.payload,
    isRecording: false
  }),
  [voiceProcessSuccess]: (state, action) => ({
    ...state,
    resultText: action.payload,
    resultError: initialState.resultError
  }),
  [voiceProcessFail]: (state, action) => ({
    ...state,
    resultError: action.payload
  })
}, initialState)

export default audio
