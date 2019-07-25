import {verifyElementCopy} from '../utils/mochaw'
import Screen from './Screen.js'

class PoaIntro extends Screen {
  get title() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get requirementsHeader() { return this.$('.onfido-sdk-ui-ProofOfAddress-PoAIntro-requirements')}
  get firstRequirement() { return this.$('.onfido-sdk-ui-ProofOfAddress-PoAIntro-requirement:nth-child(2) > span')}
  get secondRequirement() { return this.$('.onfido-sdk-ui-ProofOfAddress-PoAIntro-requirement:nth-child(3) > span')}
  get thirdRequirement() { return this.$('.onfido-sdk-ui-ProofOfAddress-PoAIntro-requirement:nth-child(4) > span')}
  get startVerificationButton() { return this.$('.onfido-sdk-ui-Button-button-text')}
  
  async verifyTitle(copy) {
    verifyElementCopy(this.title, copy)
  }

  async verifyRequirementsHeader(copy) {
    const poaIntroStrings = copy.proof_of_address
    verifyElementCopy(this.requirementsHeader, poaIntroStrings.intro.requirements)
  }

  async verifyFirstRequirement(copy) {
    verifyElementCopy(this.firstRequirement, copy)
  }

  async verifySecondRequirement(copy) {
    verifyElementCopy(this.secondRequirement, copy)
  }

  async verifyThirdRequirement(copy) {
    verifyElementCopy(this.thirdRequirement, copy)
  }

  async verifyStartVerificationButton(copy) {
    const poaIntroStrings = copy.proof_of_address
    verifyElementCopy(this.startVerificationButton, poaIntroStrings.intro.start)
  }

  async clickStartVerificationButton() {
    this.startVerificationButton.click()
  }
}

export default PoaIntro;
