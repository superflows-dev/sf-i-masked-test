/**
 * @license
 * Copyright 2022 Superflow.dev
 * SPDX-License-Identifier: MIT
 */

import {LitElement, html, css, PropertyValueMap} from 'lit';
// import {customElement, query, queryAssignedElements, property} from 'lit/decorators.js';
import {customElement, query, property} from 'lit/decorators.js';
// import {customElement, query, property} from 'lit/decorators.js';
// import Util from './util';
// import {LitElement, html, css} from 'lit';
// import {customElement} from 'lit/decorators.js';


/*

Modes: View, Add, Edit, Delete, Admin
DB: partitionKey, rangeKey, values

*/

/**
 * SfIMaskedText element.
 * @fires renderComplete - When the list is populated
 * @fires valueChanged - When the value is changed
 * @property apiId - backend api id
 * @property label - input label
 * @property name - name of the input
 * @property mode - mode of operation
 * @property selectedId - id to preselect
 * @property selectedValue - callback function
 */
@customElement('sf-i-masked-text')
export class SfIMaskedText extends LitElement {
  
  @property()
  text!: string;

  @property()
  minLength!: number;

  static override styles = css`

    .flex-grow {
      flex-grow: 1;
    }

    .left-sticky {
      left: 0px;
      position: sticky;
    }

    .color-lt-gray {
      color: #999;
      font-size: 95%;
    }

    .link {
      text-decoration: underline;
      cursor: pointer;
    }

    .cursor {
      cursor: pointer;
    }

    .gone {
      display: none
    }

    .loader-element {
      position: fixed;
      right: 10px;
      top: 10px;
      margin-left: 5px;
    }

    .td-head {
      text-transform: capitalize;
    }

    .td-body {
      padding: 5px;
    }

    .td-dark {
      background-color: #e9e9e9;
    }

    .td-highlight {
      background-color: black;
      color: white;
    }

    .td-light {
      background-color: #f6f6f6;
    }

    td {
      white-space: nowrap;
    }

    .align-start {
      align-items: flex-start;
    }

    .align-end {
      align-items: flex-end;
    }

    .align-center {
      align-items: center;
    }
    
    .lds-dual-ring {
      display: inline-block;
      width: 50px;
      height: 50px;
    }
    .lds-dual-ring:after {
      content: " ";
      display: block;
      width: 50px;
      height: 50px;
      margin: 0px;
      border-radius: 50%;
      border: 2px solid #fff;
      border-color: #888 #ddd #888 #ddd;
      background-color: white;
      animation: lds-dual-ring 0.8s linear infinite;
    }

    .lds-dual-ring-lg {
      display: inline-block;
      width: 30px;
      height: 30px;
    }
    .lds-dual-ring-lg:after {
      content: " ";
      display: block;
      width: 30px;
      height: 30px;
      margin: 0px;
      border-radius: 50%;
      border: 3px solid #fff;
      border-color: #888 #ddd #888 #ddd;
      animation: lds-dual-ring 0.8s linear infinite;
    }

    .div-row-error {
      display: flex;
      justify-content: center;
      position: fixed;
      position: fixed;
      top: 0px;
      right: 0px;
      margin-top: 20px;
      margin-right: 20px;
      display: none;
      align-items:center;
      background-color: white;
      border: dashed 1px red;
      padding: 20px;
    }

    .div-row-error-message {
      color: red;
      padding: 5px;
      background-color: white;
      text-align: center;
    }

    .div-row-success {
      display: flex;
      justify-content: center;
      position: fixed;
      top: 0px;
      right: 0px;
      margin-top: 20px;
      margin-right: 20px;
      display: none;
      align-items:center;
      background-color: white;
      border: dashed 1px green;
      padding: 20px;
    }

    .div-row-success-message {
      color: green;
      padding: 5px;
      background-color: white;
      text-align: center;
    }

    .d-flex {
      display: flex;
    }

    .flex-col {
      flex-direction: column;
    }

    .justify-center {
      justify-content: center;
    }

    .justify-between {
      justify-content: space-between;
    }

    .justify-end {
      justify-content: flex-end;
    }

    @keyframes lds-dual-ring {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }  

    .hide {
      display: none;
    }

    .lb {
      width: 5%
    }
    .rb {
      width: 5%
    }

    @media (orientation: landscape) {

      .lb {
        width: 30%
      }
      .rb {
        width: 30%
      }

    }

  `;

  @query('.SfIMaskedTextC')
  _SfIEventsC: any;

  @query('#button-unmask')
  _SfButtonNext: any;

  @query('#button-mask')
  _SfButtonPrev: any;

  @query('#div-text')
  _SfDivText: any;

  constructor() {
    super();
  }

  truncate = ( str: string, n: number, useWordBoundary: boolean ) => {
    if (str.length <= n) { return str; }
    const subString = str.slice(0, n-1); // the original check
    return (useWordBoundary 
      ? subString.slice(0, subString.lastIndexOf(" ")) 
      : subString) + "&hellip;";
  };

  mask = ( valueStr: string) => {
    if(valueStr.indexOf('@') >= 0){
        const arrEmail = valueStr.split('@');
        if(arrEmail[0].length > 2) {
            arrEmail[0] = (arrEmail[0] + "").substring(0, 2) + "x".repeat(arrEmail[0].length - 3) + (arrEmail[0] + "").substring(arrEmail[0].length - 1, arrEmail[0].length);
        } 
        arrEmail[1] = (arrEmail[1] + "").substring(0, 1) + "x".repeat(arrEmail[1].length - 2) + (arrEmail[1] + "").substring(arrEmail[1].length - 1, arrEmail[1].length);
    
        return arrEmail[0] + '@' + arrEmail[1];
    }else{
        let maskStr = valueStr
        maskStr = (maskStr + "").substring(0, 2) + "x".repeat(maskStr.length - 3) + (maskStr + "").substring(maskStr.length - 1, maskStr.length);
        return maskStr
    }
  }

  showNext = () => {
    (this._SfButtonNext as HTMLElement).style.display = 'block';
    (this._SfButtonPrev as HTMLElement).style.display = 'none';
  }

  showPrev = () => {
    (this._SfButtonNext as HTMLElement).style.display = 'none';
    (this._SfButtonPrev as HTMLElement).style.display = 'block';
  }

  renderNext = () => {
    
      var text = this.mask(this.escapeHtml(this.text));
      (this._SfDivText as HTMLDivElement).innerHTML = text;
  }

  renderPrev = () => {
    var text = this.escapeHtml(this.text);
    (this._SfDivText as HTMLDivElement).innerHTML = text;
  }

  showMasked = () => {
    this.showNext();
    this.renderNext();
  }

  showExpanded = () => {
    this.showPrev();
    this.renderPrev();
  }

  initListeners = () => {
    (this._SfButtonNext as HTMLButtonElement).addEventListener('click', () => {
      this.showExpanded();
    });
    (this._SfButtonPrev as HTMLButtonElement).addEventListener('click', () => {
      this.showMasked();
    });
  }

  loadMode = async () => {
    this.initListeners();
    this.showMasked();
  }

  protected override firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {

    this.loadMode();

  }
  
  override connectedCallback() {
    super.connectedCallback()
  }

  escapeHtml(str: String)
  {
    return str
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }
  
  override render() {

    return html`
          
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <div part="text-container" class="SfIMaskedTextC d-flex align-center">
        <div id="div-text" part="text-view">${this.escapeHtml(this.text)}</div>
        <span part="button-unmask" id="button-unmask" class="material-icons cursor color-lt-gray">visibility</span>
        <span part="button-mask" id="button-mask" class="material-icons cursor color-lt-gray">visibility_off</span>
      </div>

    `;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'sf-i-masked-text': SfIMaskedText;
  }
}
