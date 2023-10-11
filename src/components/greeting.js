import { LitElement, html } from 'lit';

export class Greeting extends LitElement {
  static properties = {
    name: '',
  };

  constructor() {
    super();
    this.name;
  }

  render() {
    const { name = 'World' } = this;

    return html`
      <p>Hello ${name}!</p>
    `;
  }
}

customElements.define('app-greeting', Greeting);
