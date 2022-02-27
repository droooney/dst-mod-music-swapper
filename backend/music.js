window.addEventListener('message', ({data}) => {
  switch (data) {
    case 'startMusic': {
      return document.querySelector('.player-controls .player-controls__btn_play')?.click()
    }

    case 'stopMusic': {
      return document.querySelector('.player-controls .player-controls__btn_pause')?.click()
    }
  }
});
