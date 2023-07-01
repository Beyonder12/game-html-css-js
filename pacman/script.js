document.getElementById('login-container').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from being submitted normally

  const playerName = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  console.log(playerName, password)
  const allowedPlayers = [
    {name : "fajri", gender: 1},
    {name : "mila", gender: 0},
    {name : "al", gender: 1},
  ];


  if (allowedPlayers.some(al => al.name === playerName) && password === 'ifg') {
    if(playerName == 'fajri') alert("Welcome, Mr. " + playerName);
    else alert("Welcome, " + playerName)
    // Hide the form and show the game board
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('game-board').style.display = 'block';

    // Start the game
    // Your game code here...
    const pacman = {
      x: 0,
      y: 0,
      speed: 5,
      direction: 'right',
      size: 10
    };

    const gameBoard = document.getElementById('game-board');
    const dots = Array.from(document.getElementsByClassName('dot')); // get all dot elements
    let dotInterval; // declare dotInterval variable
    let gameOver = false; // game state flag

    function createDot() {
      const dot = document.createElement('div');
      dot.className = 'dot';
      dot.style.left = `${Math.random() * (gameBoard.offsetWidth - 20)}px`; // Random x-position
      dot.style.top = `${Math.random() * (gameBoard.offsetHeight - 20)}px`; // Random y-position
      gameBoard.appendChild(dot);
      dots.push(dot); // add the new dot to the dots array
    }

    function update() {
      if (gameOver) {
        return; // exit the update function if game is over
      }

      let pacmanElement = document.getElementById('pacman');

      if (!pacmanElement) {
        pacmanElement = document.createElement('div');
        pacmanElement.id = 'pacman';
        gameBoard.appendChild(pacmanElement);
      }

      pacmanElement.style.width = `${pacman.size}px`;
      pacmanElement.style.height = `${pacman.size}px`;
      pacmanElement.style.left = `${pacman.x}px`;
      pacmanElement.style.top = `${pacman.y}px`;

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

      // check if pacman would hit a dot
      for (let i = 0; i < dots.length; i++) {
        let dot = dots[i];
        let dotX = dot.offsetLeft + dot.offsetWidth / 2;
        let dotY = dot.offsetTop + dot.offsetHeight / 2;
        let dx = newX + pacman.size / 2 - dotX;
        let dy = newY + pacman.size / 2 - dotY;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < (pacman.size + dot.offsetWidth) / 2) {
          dot.parentNode.removeChild(dot); // remove the dot from the game-board
          dots.splice(i, 1); // remove the dot from the dots array
          pacman.size += 20; // increase pacman's size
          pacmanElement.style.width = `${pacman.size}px`;  // Update the size of pacman
          pacmanElement.style.height = `${pacman.size}px`; // Update the size of pacman
          break;
        }
      }

      // check if pacman would go out of bounds
      if(newX >= 0 && newX <= (gameBoard.offsetWidth - pacman.size) && newY >= 0 && newY <= (gameBoard.offsetHeight - pacman.size)) {
        pacman.x = newX;
        pacman.y = newY;
      } else {
        checkOutOfBounds(pacman, gameBoard, pacmanElement);
      }

      // check if pacman is larger than the game-board
      if (pacman.size >= gameBoard.offsetWidth || pacman.size >= gameBoard.offsetHeight) {
        gameOver = true; // set game over flag
        clearInterval(dotInterval); // stop generating new dots
        setTimeout(function() {
          const playAgain = confirm('Game over! Play again?');
          if (playAgain) {
            resetGame();
          }
        }, 1000);
      }
    }

    function checkOutOfBounds(pacman, gameBoard, pacmanElement) {
      if(pacman.x < 0) pacman.x = 0;
      if(pacman.y < 0) pacman.y = 0;
      if(pacman.x > gameBoard.offsetWidth - pacman.size) pacman.x = gameBoard.offsetWidth - pacman.size;
      if(pacman.y > gameBoard.offsetHeight - pacman.size) pacman.y = gameBoard.offsetHeight - pacman.size;
      pacmanElement.style.left = `${pacman.x}px`;
      pacmanElement.style.top = `${pacman.y}px`;
    }

    function resetGame() {
      gameOver = false; // reset game state flag
      pacman.x = 0; // reset pacman's position
      pacman.y = 0;
      pacman.size = 20; // reset pacman's size
      startGame();
    }

    let gameDuration = 60000; // Game duration in milliseconds, 120000ms = 2 minutes
    function startGame() {
      dotInterval = setInterval(createDot, 1000); // Create a new dot every second.
      setInterval(update, 1000 / 60); // Update the game 60 times per second.

      // Set a timeout to end the game after gameDuration has passed
      setTimeout(function() {
        gameOver = true; // set game over flag
        clearInterval(dotInterval); // stop generating new dots
        setTimeout(function() {
          console.log(gameDuration)
          const playAgain = confirm('Game over in ' + gameDuration/1000 + ' seconds! Time\'s up. Play again?');
          if (playAgain) {
            resetGame();
          }
        }, 1000);
      }, gameDuration);
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

    startGame();
  } else {
    alert("Invalid credentials. Only 'fajr, mila, al' can play this game.");
  }
});
