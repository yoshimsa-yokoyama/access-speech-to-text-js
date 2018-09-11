/* eslint-disable no-constant-condition */
import toWavBuffer from 'audiobuffer-to-wav'
import { put, call, take, select } from 'redux-saga/effects'
import { getAudio } from '../reducers/AudioReducer'

const bufferSize = 4096

let micStream = null
let scriptProcessor = null
let audioContext = null
let audioBufferArray = []


/**
 * checkAudioContextAvailablity
 */
function checkAudioContextAvailablity() {
  if(window.AudioContext !== undefined){
    return new AudioContext()
  } else if(window.webkitAudioContext !== undefined){
    return new window.webkitAudioContext()
  }
}


/**
 * getMicStream
 */
function getMicStream() {
  return navigator.mediaDevices.getUserMedia({ audio: true, video: false, volume: 1.0 }).then(
    stream => stream,
    error => error
  )
}


/**
 * blobToBase64
 */
function blobToBase64(blob) {
  return new Promise( resolve => {

    // convert blob to base64 string
    const reader = new window.FileReader()
    reader.onload = () => {
      const dataUrl = reader.result

      resolve(dataUrl.split(',')[1])
    }

    reader.readAsDataURL(blob);
  })
}


/**
 * getAudioBuffer
 */
function getAudioBuffer () {
  const buffer = audioContext.createBuffer(
    1,
    audioBufferArray.length * bufferSize,
    audioContext.sampleRate
  )
  const channel = buffer.getChannelData(0)

  for (let i=0, len=audioBufferArray.length; i < len; i++) {
    for (let j=0; j < bufferSize; j++) {
      channel[i * bufferSize + j] = audioBufferArray[i][j]
    }
  }

  return buffer
}


/**
 * getAudioBlob
 */
function getAudioBlob(buffer) {
  const wavBuffer = toWavBuffer(buffer)

  return new window.Blob([ new DataView(wavBuffer) ], { type: 'audio/wav' })
}


/**
 * getAudioBase64
 */
function* getAudioBase64() {
  const buffer = yield call(getAudioBuffer)
  const wavBlob = yield call(getAudioBlob, buffer)

  if (wavBlob !== undefined) return yield call(blobToBase64, wavBlob)
}


/**
 * processMicStream
 */
function processMicStream(micStream) {
  // AudioBuffer格納用配列を初期化
  audioBufferArray = []

  // ストリームをメディアストリームに変換
  const mediaStreamSource = audioContext.createMediaStreamSource(micStream)

  // メディアストリームの処理をscriptProcessorのonaudioprocessで記述
  scriptProcessor = audioContext.createScriptProcessor(bufferSize, 1, 1)
  scriptProcessor.onaudioprocess = event => {
    const channel = event.inputBuffer.getChannelData(0)
    const buffer = new Float32Array(bufferSize)

    // 流れてくるメディアストリームの値から単体AudioBufferを作成
    for(let i=0; i < bufferSize; i++) {
      buffer[i] = channel[i]
    }
    // 単体AudioBufferをAudioBufferArrayに格納し続ける
    audioBufferArray.push(buffer)
  }

  //ストリームを保存用プロセッサーに接続
  mediaStreamSource.connect(scriptProcessor)
  // 保存用プロセッサーを出力に接続
  scriptProcessor.connect(audioContext.destination)
}


/**
 * startRecProcess
 */
function* startRecProcess() {
  // 1. check if AudioContext is available on user's device
  audioContext = yield call(checkAudioContextAvailablity)

  if (!audioContext) {
    yield put({ type: 'START_RECORD_PROCESS_FAIL', payload: {
      code: -1,
      message: ''
    }})

    return
  }

  // 2. check if the store already has micStream
  if (
    micStream instanceof MediaStream &&
    micStream.getAudioTracks()[0].readyState === 'live'
  ) {
    // recording process has been running (micStream already exists in the store)
    yield call(processMicStream, micStream)
    yield put({ type: 'START_RECORD_PROCESS_SUCCESS'})

    return
  } else {
    // create stream from mic input and start recording process
    micStream = null
    micStream = yield call(getMicStream)

    if (micStream instanceof MediaStream) {
      yield call(processMicStream, micStream)
      yield put({ type: 'START_RECORD_PROCESS_SUCCESS'})
    } else {
      yield put({ type: 'START_RECORD_PROCESS_FAIL', payload: {
        code: -1,
        message: `
          ${micStream.name ? micStream.name : 'UnknownError'}:
          ${micStream.message ? micStream.message : ''}
          (CODE: ${micStream.code ? micStream.code : ''})
        `
      }})
    }
  }
}


/**
 * stopRecProcess
 */
function* stopRecProcess() {
  const audio = select(getAudio)

  // 1. check if recording has started
  if (audio.isRecording) {
    yield put({ type: 'STOP_RECORD_PROCESS_FAIL', payload: {
      code: -1,
      message: `Recording process hasn't started yet.`
    }})
  } else {
    // プロセッサーから音源を切り離す
    scriptProcessor.disconnect()
    scriptProcessor = null

    // ストリームを止める
    micStream.getAudioTracks()[0].stop()

    const wavBase64 = yield call(getAudioBase64)

    if (wavBase64.length > 0) {
      yield put({ type: 'STOP_RECORD_PROCESS_SUCCESS', payload: wavBase64})
    } else {
      yield put({ type: 'STOP_RECORD_PROCESS_FAIL', payload: {
        code: -1,
        message: `failed to get wav audio blob`
      }})
    }
  }
}


/**
 * watchRec
 */
export default function* watchRec() {
  while(true) {
    // 1. wait until RECORDING_START action is coming in
    yield take('RECORDING_START')
    yield call(startRecProcess)

    console.log('>>> recording start')

    // 2. wait until RECORDING_STOP action is coming in
    yield take('RECORDING_STOP')
    yield call(stopRecProcess)

    console.log('>>> recording stop')
  }
}
