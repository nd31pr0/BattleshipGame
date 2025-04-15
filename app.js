import GameController from './gameController.js';

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  GameController.init();
  GameController.setupEventListeners();
});