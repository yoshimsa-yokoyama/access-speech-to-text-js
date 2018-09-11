export default class SpeechToTextResultList {
  constructor(element, store) {
    this.view = element
    this.store = store

    this.audio = ''
    this.result = ''

    this.store.subscribe(() => this.render())
  }

  render() {
    // array buffer test
    if (this.audio !== this.store.getState().audio.sourceBase64) {
      this.audio = this.store.getState().audio.sourceBase64

      const audioElm = document.createElement('audio')
      audioElm.src = `data:audio/wav;base64,${this.audio}`
      audioElm.controls = true
      this.view.appendChild(audioElm)
    }

    // result test
    if (this.result !== this.store.getState().audio.resultText) {
      this.result = this.store.getState().audio.resultText

      const textElm = document.createElement('p')
      textElm.textContent = `↑ ${this.result}`
      this.view.appendChild(textElm)
    }

    // result error test
    if (this.store.getState().audio.resultError !== null) {
      const textElm = document.createElement('p')
      textElm.textContent = `> ERROR: ${this.store.getState().audio.resultError.message}`
      this.view.appendChild(textElm)
    }
  }
}
