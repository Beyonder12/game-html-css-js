document.getElementById('login-form').addEventListener('submit', function(event) {
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

    // Get the audio element
    const bgMusic = document.getElementById("bgMusic");
    const playerGender = allowedPlayers.find(al => al.name === playerName).gender;
    const title = playerGender === 1 ? "Mr. " : "Ms. ";
    alert("Welcome, " + title + playerName);
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
      size: 80
    };

    const gameBoard = document.getElementById('game-board');
    let dots = Array.from(document.getElementsByClassName('dot')); // get all dot elements
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

    let frame = 0;

    function update(playerName) {
      if (gameOver) {
        return; // exit the update function if game is over
      }

      let pacmanElement = document.getElementById('pacman');

      if (!pacmanElement) {
        pacmanElement = document.createElement('div');
        pacmanElement.id = 'pacman';

        if(playerName === "fajri") {
          pacmanElement.style.backgroundImage = "url('fajri.png')";
          pacmanElement.style.backgroundSize = "contain";
          pacmanElement.style.backgroundRepeat = "no-repeat";
          pacmanElement.style.backgroundPosition = "center";
        } else if (playerName === "mila") {
          pacmanElement.style.backgroundImage = "url('mila.png')";
          pacmanElement.style.backgroundSize = "contain";
          pacmanElement.style.backgroundRepeat = "no-repeat";
          pacmanElement.style.backgroundPosition = "center";

        } else if (playerName === "al") {
          pacmanElement.style.backgroundImage = "url('al.png')";
          pacmanElement.style.backgroundSize = "contain";
          pacmanElement.style.backgroundRepeat = "no-repeat";
          pacmanElement.style.backgroundPosition = "center";
        } else {
          pacmanElement.style.backgroundImage = "url('anom.png')";
          pacmanElement.style.backgroundSize = "contain";
          pacmanElement.style.backgroundRepeat = "no-repeat";
          pacmanElement.style.backgroundPosition = "center";
        }

        pacmanElement.className = 'pacman-open'; // Add this line
        gameBoard.appendChild(pacmanElement);
      }
      // determine whether pacman's mouth should be open or closed
      let mouthClass = frame % 10 < 5 ? 'pacman-open' : 'pacman-closed';
      // apply the appropriate classes for pacman's state and direction
      pacmanElement.className = 'pacman ' + mouthClass + ' pacman-' + pacman.direction;

      frame++; // Increment frame count

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
      let rndx;
      let rndy;
      for (let i = 0; i < dots.length; i++) {
        let dot = dots[i];
        let dotX = dot.offsetLeft + dot.offsetWidth / 2;
        let dotY = dot.offsetTop + dot.offsetHeight / 2;
        let dx = newX + pacman.size / 2 - dotX;
        let dy = newY + pacman.size / 2 - dotY;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < (pacman.size + dot.offsetWidth) / 2) {
          score++; // Increase the score
          rndx = Math.random() * (gameBoard.offsetWidth - 20)
          rndy = Math.random() * (gameBoard.offsetHeight/10)
          createScorePopup(score, rndx, rndy);
          dot.parentNode.removeChild(dot); // remove the dot from the game-board
          dots.splice(i, 1); // remove the dot from the dots array
          pacman.size += 2; // increase pacman's size
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
            resetGame(playerName);
          }
        }, 100);
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

    function resetGame(playerName) {
      // Pause the music
      bgMusic.pause();

      score = 0; // reset the score
      document.getElementById('score-display').textContent = "Score: " + score;

      gameOver = false; // reset game state flag
      pacman.x = 0; // reset pacman's position
      pacman.y = 0;
      pacman.speed+=3;
      pacman.size += 20; // reset pacman's size
      dots.forEach((dot) => dot.remove()); // remove all dots from the DOM
      dots = []; // clear the dots array
      startGame(playerName);
    }

    let gameDuration = 10000;
    let score = 0;

    function startGame(playerName) {


      // Set the volume (optional)
      bgMusic.volume = 0.5;

      // Play the music
      bgMusic.play();
      dotInterval = setInterval(createDot, 1000); // Create a new dot every second.
      let updateInterval = setInterval(() => update(playerName), 1000 / 60); // Update the game 60 times per second.

      // Set a timeout to end the game after gameDuration has passed
      setTimeout(function() {
        gameOver = true; // set game over flag
        clearInterval(dotInterval); // stop generating new dots
        clearInterval(updateInterval)
        setTimeout(function() {
          bgMusic.pause();
          console.log(gameDuration)
          const playAgain = confirm('Game over in ' + gameDuration/1000 + ' seconds! Time\'s up. Play again? Your score :' + score);
          if (playAgain) {
            resetGame(playerName);
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
    function createScorePopup(score, x, y) {
      const popup = document.createElement('div');
      popup.className = 'score-popup';
      popup.textContent = `+${score}`;
      popup.style.left = `${x}px`;
      popup.style.top = `${y}px`;
      gameBoard.appendChild(popup);

      // Remove the popup after it has faded out
      setTimeout(() => {
        gameBoard.removeChild(popup);
      }, 2000); // This should match the length of the animation
    }


    startGame(playerName);
  } else {
    alert("Invalid credentials. Only 'fajr, mila, al' can play this game.");
  }
});
