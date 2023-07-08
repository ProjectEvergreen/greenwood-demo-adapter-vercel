export default class AboutPage extends HTMLElement {
  async connectedCallback() {
    this.innerHTML = `
      <h1>Hello from the About page</h1>
    `;
  }
}