export default class Card extends HTMLElement {

  selectArtist() {
    alert(`selected artist is => ${this.getAttribute('title')}!`);
  }

  connectedCallback() {
    const thumbnail = this.getAttribute('thumbnail');
    const title = this.getAttribute('title');

    this.innerHTML = `
      <div>
        <h1>${title}</h1> 
        <button onclick="this.parentNode.parentNode.selectArtist()">View Artist Details</button>
        <img src="${thumbnail}" loading="lazy" width="25%">
        <hr/>
      </div>
    `;
  }
}

customElements.define('app-card', Card);