export default class RecordingStopButton {
  constructor(element, store) {
    this.view = element
    this.store = store

    this.elementEventHandlers()
  }

  elementEventHandlers() {
    this.view.addEventListener('click', () => {
      this.store.dispatch({ type: 'RECORDING_STOP' })
    })
  }
}
