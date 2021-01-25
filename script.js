//Player
const Player = (playerNum) => {
  let _state = {
    playerNum,
    name: getName(),
    type: 'Human',
    marker: (playerNum===1) ? 'X' : 'O',
  };

  //Function to return name of player from form
  function getName() {
    if (document.querySelector(`input[id=js__p${playerNum}-name]`)) {
    return document.querySelector(`input[id=js__p${playerNum}-name]`).value;
    }
  }
  //Function to return type of player from form
  function _getType() {
    return document.querySelector(`input[name=js__p${playerNum}-type]:checked`).value;
  }

  const getMarker = () => _state.marker;
  const getPlayerNum = () => _state.playerNum;

  return {getName, getMarker, getPlayerNum}
};

//Player that selects
const Human = ((name));

//Player that autoselects
//gameboard
const game = (() => {
  //Store board values in 9 element array, initial value is null
  let _board = Array(9).fill(null);
  //Initialize turn tracker
  let _isP1Turn = true;
  //Create players
  const player1 = Player(1);
  const player2 = Player(2);
  const _wins = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]

  const getBoard = () => Array.from(_board);
  const nextTurn = () => {_isP1Turn = !_isP1Turn};
  const currentPlayer = () => (_isP1Turn) ? player1 : player2;
  const markBoard = (index) => {
    _board[index] = currentPlayer().getMarker();
  }
  const isPlayable = (index) => (_board[index] === null);

  //Function to check wins. Returns true if winner, false if no winner yet.
  const checkWins = (player) => {
    if (game.getBoard().every(cell => cell !== null)) {
      return true;
    }
    else {
      return (
        _wins.some((win) => {
        return win.every(index => _board[index] === player.getMarker());
        })
      );
    }
  };
  const newBoard = () => {
    _board = Array(9).fill(null);
    _isP1Turn = true;
  }
  return {
    nextTurn,
    currentPlayer,
    getBoard,
    markBoard,
    player1,
    player2,
    isPlayable,
    checkWins,
    newBoard,
  };
})();

//

//displayControl
const displayControl = (() => {
  //Function to render gameboard to the window
  const _newCell = (content, index) => {
    const boardDiv = document.querySelector('#gameboard');
    let cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('data-index',index)
    //Check if cell is marked or empty and assign appropriate marker
    cell.textContent = (content === null) ? '' : content.toUpperCase();
    boardDiv.appendChild(cell);
    //User clicks on cell
    cell.addEventListener('click', play);
  };
  const play = (e) => {
    let index = e.target.getAttribute('data-index');
    if (game.isPlayable(index)) {
      game.markBoard(index);
      e.target.textContent = game.getBoard()[index];
      e.target.classList.add(`p${game.currentPlayer().getPlayerNum()}`)
      if (game.checkWins(game.currentPlayer())) {
        showWinner();
      }
      else {
        game.nextTurn();
      }
    }
  };
  const render = () => {
    document.querySelector('#gameboard').textContent = '';
    game.getBoard().map((value,index) => {
      _newCell(value,index);
    });
  };
  const showWinner = () => {
    const winMessage = document.querySelector('#js-win-message');
    winMessage.style.removeProperty('display');
    const winner = document.querySelector('#winner')
    if (game.getBoard().every(cell => cell !== null)) {
      winner.textContent = 'Draw! Everyone is a winner?';
    }
    else {
      const winnerName = game.currentPlayer().getName();
      winner.textContent = `${winnerName} wins!`;
    }
    for (cell of document.querySelectorAll('.cell')) {
      cell.removeEventListener('click', play);
    }
  };
  const newGameBtn = (() => {
    const btn = document.querySelector('#js-new-game-btn');
    btn.addEventListener('click', () => {
      document.querySelector('#js-win-message').style.display = 'none';
      game.newBoard();
      render();
    })
  })();
  const isolate = (targetElement) => {
    const bodyElements = document.querySelector('body').children
    for (let child of bodyElements) {
      if (child !== targetElement && child.tagName != 'script') {
        child.style.display = 'none';
      }
    };
  }
  render();
  return {render}
})();
