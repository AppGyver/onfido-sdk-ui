import { h, render } from 'preact'
import { getCountryCodes } from 'react-phone-number-input/modules/countries'
import labels from 'react-phone-number-input/locale/default.json'

import App from './components/App'
import { fetchUrlsFromJWT } from '~utils/jwt'
import { upperCase } from '~utils/string'

/**
 * Renders the Onfido component
 *
 * @param {DOMelement} [merge] preact requires the element which was created from the first render to be passed as 3rd argument for a rerender
 * @returns {DOMelement} Element which was generated from render
 */
const onfidoRender = (options, el, merge) =>
  render(<App options={options}/>, el, merge)


const noOp = ()=>{}

const defaults = {
  token: undefined,
  urls: {
    onfido_api_url: `${process.env.ONFIDO_API_URL}`,
    telephony_url: `${process.env.SMS_DELIVERY_URL}`,
    hosted_sdk_url: `${process.env.MOBILE_URL}`,
    detect_document_url: `${process.env.ONFIDO_SDK_URL}`,
    sync_url: `${process.env.DESKTOP_SYNC_URL}`
  },
  containerId: 'onfido-mount',
  onComplete: noOp,
  onError: noOp
}

const isStep = val => typeof val === 'object'
const formatStep = typeOrStep => isStep(typeOrStep) ?  typeOrStep : {type:typeOrStep}

const formatOptions = ({steps, smsNumberCountryCode, ...otherOptions}) => ({
  ...otherOptions,
  urls: jwtUrls(otherOptions),
  smsNumberCountryCode: validateSmsCountryCode(smsNumberCountryCode),
  steps: (steps || ['welcome','document','face','complete']).map(formatStep)
})

const experimentalFeatureWarnings = ({steps}) => {
  const isDocument = (step) => step.type === 'document'
  const documentStep = steps.find(isDocument)
  const isUseWebcamOptionEnabled = documentStep && documentStep.options && documentStep.options.useWebcam
  if (isUseWebcamOptionEnabled) {
    console.warn("`useWebcam` is an experimental option and is currently discouraged")
  }
  const isLiveDocumentCaptureEnabled = documentStep && documentStep.options && documentStep.options.useLiveDocumentCapture
  if (isLiveDocumentCaptureEnabled) {
    console.warn("`useLiveDocumentCapture` is a beta feature and is still subject to ongoing changes")
  }
}

const isSMSCountryCodeValid = (smsNumberCountryCode) => {
  // If you need to refactor this code, remember not to introduce large libraries such as
  // libphonenumber-js in the main bundle!
  const countries = getCountryCodes(labels)
  const isCodeValid = countries.includes(smsNumberCountryCode)
  if (!isCodeValid) {
    console.warn("`smsNumberCountryCode` must be a valid two-characters ISO Country Code. 'GB' will be used instead.")
  }
  return isCodeValid
}

const validateSmsCountryCode = (smsNumberCountryCode) => {
  if (!smsNumberCountryCode) return 'GB'
  const upperCaseCode = upperCase(smsNumberCountryCode)
  return isSMSCountryCodeValid(upperCaseCode) ? upperCaseCode : 'GB'
}

const jwtUrls = ({token}) => {
  const urls = token && fetchUrlsFromJWT(token)
  return {...defaults.urls, ...urls}
}

export const init = (opts) => {
  console.log("onfido_sdk_version", process.env.SDK_VERSION)
  const options = formatOptions({ ...defaults, ...opts })
  experimentalFeatureWarnings(options)


  const containerEl = document.getElementById(options.containerId)
  const element = onfidoRender(options, containerEl)

  return {
    options,
    element,
    /**
     * Does a merge with previous options and rerenders
     *
     * @param {Object} changedOptions shallow diff of the initialised options
     */
    setOptions (changedOptions) {
      this.options = formatOptions({...this.options,...changedOptions});
      this.element = onfidoRender( this.options, containerEl, this.element )
      return this.options;
    },
    tearDown() {
      render(null, containerEl, this.element)
    }
  }
}
