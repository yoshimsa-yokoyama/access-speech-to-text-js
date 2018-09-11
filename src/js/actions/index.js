import { createAction } from 'redux-actions'

export const initializeApp = createAction('INITIALIZE_APP')
export const startRecording = createAction('RECORDING_START')
export const stopRecording = createAction('RECORDING_STOP')
export const startRecordProcessSuccess = createAction('START_RECORD_PROCESS_SUCCESS')
export const startRecordProcessFail = createAction('START_RECORD_PROCESS_FAIL')
export const stopRecordProcessSuccess = createAction('STOP_RECORD_PROCESS_SUCCESS')
export const stopRecordProcessFail = createAction('STOP_RECORD_PROCESS_FAIL')
export const voiceProcessSuccess = createAction('VOICE_PROCESS_SUCCESS')
export const voiceProcessFail = createAction('VOICE_PROCESS_FAIL')
