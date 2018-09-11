export default class RecordingStartButton {
  constructor(element, store) {
    this.view = element
    this.store = store

    this.elementEventHandlers()
  }

  elementEventHandlers() {
    this.view.addEventListener('click', () => {
      this.store.dispatch({ type: 'RECORDING_START' })
    })
  }
}
