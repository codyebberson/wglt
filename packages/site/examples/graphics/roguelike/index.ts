import { App } from './app';

const app = new App();

// Clear the window hash on load
// Always start at the root
if (window.location.hash && window.location.hash !== '#') {
  window.location.hash = '';
}

// Subscribe to future window hash change events
window.addEventListener('hashchange', handleHashChange);

function handleHashChange(): void {
  const hash = window.location.hash;

  if (hash === '#startgame') {
    app.startGame();
  } else if (hash === '#game') {
    app.playGame();
  } else if (hash === '#highscores') {
    app.showHighScores();
  } else if (hash === '#credits') {
    app.showCredits();
  } else {
    app.showMainMenu();
  }
}
