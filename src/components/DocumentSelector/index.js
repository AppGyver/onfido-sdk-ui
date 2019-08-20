// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import style from './style.css'
import { kebabCase } from '~utils/string'
import { isEmpty } from '~utils/object'
import classNames from 'classnames'
import { idDocumentOptions, poaDocumentOptions } from './documentTypes'
import type { DocumentOptionsType, GroupType } from './documentTypes'

import { localised } from '../../locales'
import type { LocalisedType } from '../../locales'

type Props = {
  className?: string,
  documentTypes: Object,
  country?: string,
  setDocumentType: string => void,
  nextStep: () => void,
  previousStep: Function,
  events: Object,
} & LocalisedType

type WithDefaultOptions = {
  defaultOptions: () => DocumentOptionsType[],
}

const always: any => boolean = () => true

// The value of these options must match the API document types.
// See https://documentation.onfido.com/#document-types
class DocumentSelector extends Component<Props & WithDefaultOptions> {

  getOptions = () => {
    const {documentTypes, defaultOptions, country = 'GBR' } = this.props
    const defaultDocOptions = defaultOptions().filter(
      ({ checkAvailableInCountry = always }) => checkAvailableInCountry(country)
    )
    const checkAvailableType = isEmpty(documentTypes) ? always : type => documentTypes[type]
    const options = defaultDocOptions.filter(({ value: type }) => checkAvailableType(type))

    // If no valid options passed, default to defaultDocOptions
    return options.length ? options : defaultDocOptions
  }

  handleSelect = (value: string) => {
    const { setDocumentType, nextStep } = this.props
    setDocumentType(value)
    nextStep()
  }

  renderOption = (option: DocumentOptionsType) => (
    <li>
      <button
        type="button"
        onClick={() => this.handleSelect(option.value)}
        className={style.option}
      >
        <div className={`${style.icon} ${style[option.icon]}`} />
        <div className={style.content}>
          <div className={style.optionMain}>
            <p className={style.label}>{option.label}</p>
            {option.hint &&
              <div className={style.hint}>{option.hint}</div>
            }
            {option.warning &&
              <div className={style.warning}>{option.warning}</div>
            }
          </div>
          {option.eStatementAccepted &&
            <div className={style.tag}>{
              this.props.translate('document_selector.proof_of_address.estatements_accepted')
            }</div>
          }
        </div>
      </button>
    </li>
  )

  componentDidMount() {
    const { previousStep } = this.props
    this.props.events.on('backToPreviousView', previousStep)
  }

  componentWillUnmount() {
    this.props.events.removeAllListeners('backToPreviousView')
  }

  render() {
    const documentOptions = this.getOptions()
    const { className, translate } = this.props
    return (
      <ul
        aria-label={translate('accessibility.document_types')}
        className={classNames(style.list, className)}>
        {documentOptions.map(this.renderOption)}
      </ul>
    )
  }
}

const LocalisedDocumentSelector = localised(DocumentSelector)

const withDefaultOptions = (types: Object, group: GroupType) =>
  (props: Props) =>
    <LocalisedDocumentSelector
      {...props}
      defaultOptions={ () => {
        const typeList = Object.keys(types)
        return typeList.map(value => {
          const { icon = `icon-${kebabCase(value)}`, hint, warning, ...other } = types[value]
          return {
            ...other,
            icon,
            value,
            label: props.translate(value),
            hint: hint ? props.translate(`document_selector.${group}.${hint}`) : '',
            warning: warning ? props.translate(`document_selector.${group}.${warning}`) : ''
          }
        })
      }}
    />

export const IdentityDocumentSelector = withDefaultOptions(idDocumentOptions, 'identity')

export const PoADocumentSelector = withDefaultOptions(poaDocumentOptions, 'proof_of_address')
