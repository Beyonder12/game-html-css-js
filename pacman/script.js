
document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from being submitted normally

  var playerName = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  console.log(playerName, password)
  const allowedPlayers = ["mila", "al", "fajr"];

  if (allowedPlayers.includes(playerName) && password === 'ifg') {
    alert("Welcome, Mr. " + playerName);
    // Hide the form and show the game board
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('game-board').style.display = 'block';

    // Start the game
    // Your game code here...
    var pacman = {
      x: 0,
      y: 0,
      speed: 5,
      direction: 'right',
      size: 10
    };

    var gameBoard = document.getElementById('game-board');
    var dots = Array.from(document.getElementsByClassName('dot')); // get all dot elements

    function createDot() {
      var dot = document.createElement('div');
      dot.className = 'dot';
      dot.style.left = `${Math.random() * (gameBoard.offsetWidth - 20)}px`; // Random x-position
      dot.style.top = `${Math.random() * (gameBoard.offsetHeight - 20)}px`; // Random y-position
      gameBoard.appendChild(dot);
      dots.push(dot); // add the new dot to the dots array
    }

    function update() {
      var pacmanElement = document.getElementById('pacman');

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
          pacman.size += 5; // increase pacman's size
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
        alert('Game over!');
        pacman.x = 0; // reset pacman's position
        pacman.y = 0;
        pacman.size = 20; // reset pacman's size
        pacmanElement.style.width = `${pacman.size}px`;  // Reset the size of pacman
        pacmanElement.style.height = `${pacman.size}px`; // Reset the size of pacman
        clearInterval(dotInterval); // stop generating new dots
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
    var dotInterval = setInterval(createDot, 1000); // Create a new dot every second.
  } else {
    alert("Invalid credentials. Only 'fajr, mila, al' can play this game.");
  }
});

