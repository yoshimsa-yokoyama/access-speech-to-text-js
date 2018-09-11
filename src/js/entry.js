import { configuredStore } from './store'
import RecordingStartButton from './atoms/RecordingStartButton'
import RecordingStopButton from './atoms/RecordingStopButton'
import SpeechToTextResultList from './atoms/SpeechToTextResultList'

const store = configuredStore()

new RecordingStartButton(document.getElementById('recordingStart'), store)
new RecordingStopButton(document.getElementById('recordingStop'), store)
new SpeechToTextResultList(document.getElementById('list'), store)
