import '../components/card.js';
import { getArtists } from '../services/artists.js';

export default class ArtistsPage extends HTMLElement {
  async connectedCallback() {
    const artists = await getArtists();
    const html = artists.map(artist => {
      const { name, imageUrl } = artist;

      return `
        <app-card
          title="${name}"
          thumbnail="${imageUrl}"
        >
        </app-card>
      `;
    }).join('');

    this.innerHTML = `
      <p>Owen - include text brefily explaining what this is doing here.</p>
      <h1>List of Artists: ${artists.length}</h1>
      <div class="artists-cards-contianer">
        ${html}
      </div>
    `;
  }
}
