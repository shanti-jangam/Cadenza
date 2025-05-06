import axios from 'axios';

class MusicAI {
  constructor() {
    this.baseURL = 'https://musicgen-api.herokuapp.com'; // Example free API
  }

  async generateMelody(prompt) {
    try {
      const response = await axios.post(`${this.baseURL}/generate`, {
        prompt,
        style: 'classical',
        length: 16
      });
      return response.data.notes;
    } catch (error) {
      console.error('Error generating melody:', error);
      return [];
    }
  }

  async harmonize(melody) {
    try {
      const response = await axios.post(`${this.baseURL}/harmonize`, {
        melody,
        style: 'jazz'
      });
      return response.data.harmony;
    } catch (error) {
      console.error('Error harmonizing:', error);
      return [];
    }
  }
}

export default new MusicAI(); 