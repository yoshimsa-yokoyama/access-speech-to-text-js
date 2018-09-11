import { fork } from 'redux-saga/effects'
import watchRec from './voiceRecordSaga'
import watchSpeechToText from './speechToTextSaga'

export default function* rootSaga() {
  yield fork(watchRec)
  yield fork(watchSpeechToText)
}
