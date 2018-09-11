/* eslint-disable no-constant-condition */
import { API_KEY, LANG_CODE } from '../constants'
import fetch from 'isomorphic-fetch'
import { put, call, take } from 'redux-saga/effects'


/**
 * fetchTextData
 */
function fetchTextData(b64WavAudio) {
  return new Promise( resolve => {
    fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${API_KEY}`, {
      method: 'POST',
      // headers: {
      //   authorization: `Bearer ${ACCESS_TOKEN}`,  // test purpose
      // },
      body: JSON.stringify({
        config: {
          languageCode: `${LANG_CODE}`,
          // encoding: `${AUDIO_ENCODING}`,
          // sampleRateHertz: audioContext.sampleRate,
          // maxAlternatives: MAX_ALT,
          // profanityFilter: PROFANITY_FILTER_FLAG,
          // speechContexts: [{
          //   phrases: SPEECH_CONTEXT_PHRASES
          // }],
          // enableWordTimeOffsets: ENABLE_WORDTIME_OFFSETS
        },
        audio: {
          content: b64WavAudio,
          // uri: 'uri'
        }
      }),
      mode: 'cors'
    }).then( data => {
      resolve(data)
    })
  })
}


/**
 * handleSpeechToTextSuccess
 */
function* handleSpeechToTextSuccess(text) {
  yield put({type: 'VOICE_PROCESS_SUCCESS', payload: text})
}


/**
 * handleSpeechToTextFail
 */
function* handleSpeechToTextFail(error) {
  yield put({type: 'VOICE_PROCESS_FAIL', payload: error})
}


/**
 * startSpeechToTextProcess
 */
function* startSpeechToTextProcess(b64WavAudio) {
  const result = yield call(fetchTextData, b64WavAudio)
  const json = yield call(() => (result.json()))

  if (json.results instanceof Array){
    try {
      yield call(handleSpeechToTextSuccess, json.results[0].alternatives[0].transcript)
    } catch(error) {
      yield call(handleSpeechToTextFail, {
        code: -1,
        message: `${error}`
      })
    }
  } else {
    yield call(handleSpeechToTextFail, {
      code: -1,
      message: 'result not found'
    })
  }
}


/**
 * watchSpeechToText
 */
export default function* watchSpeechToText() {
  while(true) {
    const action = yield take('STOP_RECORD_PROCESS_SUCCESS')

    yield call(startSpeechToTextProcess, action.payload)
  }
}
