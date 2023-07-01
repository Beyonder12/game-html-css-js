var pacman = {
  x: 0,
  y: 0,
  speed: 1,
  direction: 'right',
};

var gameBoard = document.getElementById('game-board');

function update() {
  var pacmanElement = document.getElementById('pacman');
  
  if (!pacmanElement) {
    pacmanElement = document.createElement('div');
    pacmanElement.id = 'pacman';
    gameBoard.appendChild(pacmanElement);
  }

  let newX = pacman.x;
  let newY = pacman.y;

  switch (pacman.direction) {
    case 'right':
      newX = pacman.x + pacman.speed;
      break;
    case 'left':
      newX = pacman.x - pacman.speed;
      break;
    case 'up':
      newY = pacman.y - pacman.speed;
      break;
    case 'down':
      newY = pacman.y + pacman.speed;
      break;
  }

  if(newX >= 0 && newX <= (gameBoard.offsetWidth - pacmanElement.offsetWidth)) {
    pacman.x = newX;
  }

  if(newY >= 0 && newY <= (gameBoard.offsetHeight - pacmanElement.offsetHeight)) {
    pacman.y = newY;
  }

  pacmanElement.style.left = `${pacman.x}px`;
  pacmanElement.style.top = `${pacman.y}px`;
}


document.addEventListener('keydown', function(e) {
  switch (e.key) {
    case 'ArrowUp':
      pacman.direction = 'up';
      break;
    case 'ArrowDown':
      pacman.direction = 'down';
      break;
    case 'ArrowLeft':
      pacman.direction = 'left';
      break;
    case 'ArrowRight':
      pacman.direction = 'right';
      break;
  }
});


setInterval(update, 1000 / 60); // Update the game 60 times per second.

