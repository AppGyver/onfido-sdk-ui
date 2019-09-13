import BasePage from './BasePage.js'

class Camera extends BasePage {
  get continueButton() { return this.$('.onfido-sdk-ui-Button-button-primary')}
  get shutterButton() { return this.$('.onfido-sdk-ui-Photo-btn')}
  get recordButton() { return this.$('.onfido-sdk-ui-Video-startRecording')}
  get stopButton() { return this.$('.onfido-sdk-ui-Video-stopRecording') }

  async takeSelfie() {
    this.driver.sleep(1000)
    this.shutterButton.click()
  }

  async startVideoRecording() {
    this.driver.sleep(1000)
    this.continueButton.click()
    this.driver.sleep(1000)
    this.recordButton.click()
  }

  async completeChallenges() {
    this.driver.sleep(1000)
    this.continueButton.click()
    this.driver.sleep(1000)
    this.stopButton.click()
  }
}

export default Camera
