import { LitElement, html, } from 'lit-element';
import { getComponentSharedStyles, } from '@cells-components/cells-lit-helpers';
import styles from './human-detector-styles.js';
import '@bbva-web-components/bbva-form-checkbox/bbva-form-checkbox.js';
import '@bbva-web-components/bbva-form-number/bbva-form-number.js';
import '@bbva-web-components/bbva-spinner/bbva-spinner.js';
import '@bbva-web-components/bbva-button-default/bbva-button-default.js';
/**
This component ...

Example:

```html
<human-detector></human-detector>
```

##styling-doc

@customElement human-detector
@polymer
@LitElement
@demo demo/index.html
*/
export class HumanDetector extends LitElement {
  static get is() {
    return 'human-detector';
  }

  // Declare properties
  static get properties() {
    return {
      isHuman: {
        type: Boolean,
        attribute: 'is-human'
      },
      operand1: {
        type: Number,
        attribute: 'operand-1'
      },
      operand2: {
        type: Number,
        attribute: 'operand-2'
      },
      continueTitle: {
        type: String,
        attribute: 'continue-title'
      },
      result: {
        type: Number
      },
      waiting: {
        type: Boolean
      },
      verified: {
        type: Boolean
      }
    };
  }

  // Initialize properties
  constructor() {
    super();
    this.operand1 = 2;
    this.operand2 = 4;
    this.continueTitle = 'Continue';
    this.verified = false;
  }

  static get styles() {
    return [
      styles,
      getComponentSharedStyles('human-detector-shared-styles')
    ]
  }

  // Define a template
  render() {
    return html`
      <bbva-form-checkbox
        ?checked="${this.isHuman}"
        @change="${this._toggleHuman}"
      >I'm human</bbva-form-checkbox>

      ${this.isHuman ? html`
        <div id="mainBlock">
          ${this.waiting ? html`
            <bbva-spinner></bbva-spinner>Eo
          ` : html`
            <div id="equationBlock">
              <p>Which is the value for x?</p>
              <p>
                <span id="op1">${this.operand1}</span> + <em>x</em> = <span id="op2">${this.operand2}</span>
              </p>
              <bbva-form-number
                id="resultInput"
                label="Answer"
                .value="${this.result}"
                @input="${this._updateResult}"
              ></bbva-form-number>
              <bbva-button-default
                id="verifyButton"
                ?disabled="${this.buttonVerifyDisabled}"
                @click="${this._verifyResult}">
                Verify
              </bbva-button-default>
              <bbva-button-default
                id="continueButton"
                ?disabled="${!this.verified}"
                @click="${this._notifyContinue}"
              >
                ${this.continueTitle}
              </bbva-button-default>
            </div>
          `}
        </div>
      ` : ''}
    `;
  }

  get buttonVerifyDisabled() {
    return this.missingData || this.verified;
  }

  get missingData() {
    return !this._isValidNumber(this.result);
  }

  _isValidNumber(value) {
    const strValue = '' + value;
    return value !== undefined && strValue.trim() !== '' && strValue === value;
  }

  _toggleHuman() {
    this.isHuman = !this.isHuman;
    if (this.isHuman) {
      this._getNewEquation();
    }
  }

  _updateResult(e) {
    this.result = e.target.value;
  }

  _getNewEquation() {
    this._reset();
    this.waiting = true;
    this.operand1 = parseInt(Math.random((new Date())) * 10);
    this.operand2 = parseInt(Math.random((new Date())) * 10);
    this.waiting = false;
  }

  _verifyResult() {
    this.verified = parseInt(this.operand1) + parseInt(this.result) === parseInt(this.operand2);
  }

  _reset() {
    this.result = undefined;
    this.verified = false;
  }

  _notifyContinue() {
    this.dispatchEvent(new CustomEvent('continue-action', {detail: 'passed'}));
  }
}

// Register the element with the browser
customElements.define(HumanDetector.is, HumanDetector);
