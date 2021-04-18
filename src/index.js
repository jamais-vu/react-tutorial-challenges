/** React.js tutorial challenges:
 * (Copied from: https://reactjs.org/tutorial/tutorial.html#wrapping-up)
 * 
 * > If you have extra time or want to practice your new React skills, here are
 * > some ideas for improvements that you could make to the tic-tac-toe game 
 * > which are listed in order of increasing difficulty:
 * > 
 * > 1. Display the location for each move in the format (col, row) in the move
 * >    history list.
 * > 2. Bold the currently selected item in the move list.
 * > 3. Rewrite Board to use two loops to make the squares instead of hardcoding
 * >    them.
 * > 4. Add a toggle button that lets you sort the moves in either ascending or
 * >    descending order.
 * > 5. When someone wins, highlight the three squares that caused the win.
 * > 6. When no one wins, display a message about the result being a draw.
 */

/** My solutions:
 * 
 * 1. In `Game.state.history` I added an array which records the indices of 
 *    which squares were selected at each turn. This is then used to determine 
 *    the column and row of each square when we construct the move history list.
 * 
 * 2. In `Game.render()` method, when the `moves` list is constructed, I 
 *    added a ternary operator which checks if the move has the current step,
 *    and if so sets its font weight to bold.
 * 
 * 3. This was the only tricky one, I had to look up how to do JSX in loops, and
 *    wasn't familiar with how React keys worked. So I didn't really figure it 
 *    out on my own.
 * 
 * 4. I added a `movesAreReversed` property to Board's `state`, and a button
 *    which flips this between `true` and `false`. I added a conditional in 
 *    Board's `render` method which reverses the order of `moves`, if true.
 * 
 * 5. I return the winning squares from `calculateWinner`, and these are passed 
 *    on to `Board``, which uses them to determine whether to color each square
 *    it renders yellow (winning) or white (not winning).
 * 
 * 6. In the `calculateWinner` function, if there's no winner, it checks whether
 *    there are empty squares left. If there are no more empty squares, it's 
 *    a draw.
 */


import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/** A single square in the game board. */
function Square(props) {
  return (
    <button 
      className="square" 
      onClick={props.onClick}
      style={props.style}
    >
      {props.value}
    </button>
  );
}

/** The Tic-Tac-Toe game board. */
class Board extends React.Component {
  renderSquare(i) {
    // TUTORIAL CHALLENGE 5: highlight winning squres
    // Background is yellow if it's a winning square, white otherwise.
    const backgroundColor = this.props.winningSquares.includes(i) ?
      {backgroundColor: 'yellow'} :
      {backgroundColor: 'white'}

    return (
      <Square
        key = {i} // Used in the `Board.render()` loop
        value = {this.props.squares[i]}
        onClick = {() => this.props.onClick(i)}
        style = {backgroundColor}
      />
    );
  }

  // TUTORIAL CHALLENGE 3: rewrite `Board.render()` to use two loops
  // Outer loop creates the rows, inner loop creates the squares in each row.
  render() {
    return (
      <div>
        {[0, 1, 2].map(row => {
          return (
            <div className="board-row" key={row}>
              {[0, 1, 2].map(col => {
                // Because board is 3x3, to get the correct squares index i, 
                // we need to multiply 3 * row then add the col index. 
                return this.renderSquare((3 * row) + col);
              })}
            </div>
          )
        })}
      </div>
    );
  }
}

/** The full state of the Tic-Tac-Toe game. */
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        keys: [], // Stack of square keys, indicating move sequence.
      }],
      stepNumber: 0,
      xIsNext: true,
      movesAreReversed: false, // true if reversed
    }
  }

  /** Handles clicks on game squares. */
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    // We call `.slice()` to create a copy of `squares`
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      // If there is a winner or draw, or if the square is already filled,
      // we return early, ignoring the click.
      return;
    }
    // We update the square with an 'X' or 'O' depending on the turn
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const keys = current.keys.slice();
    keys.push(i);

    this.setState({
      history: history.concat([{
        squares: squares,
        keys: keys
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext, // Flip whose turn it is
    });
  }

  /** Handles clicks on the list of past moves. */
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      // We can determine turn via parity because we know X goes first
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    
    // TUTORIAL CHALLENGE 5: Highlight winning squares
    const winnerAndSquares = calculateWinner(current.squares);
    let winner;
    let winningSquares = [];

    if (winnerAndSquares) {
      // If there is a winner (or a draw)
      winner = winnerAndSquares.winner;
      winningSquares = winnerAndSquares.winningSquares; // Empty array if draw
    }

    // TUTORIAL CHALLENGE 1: Display the location for each move in the history
    /* Contructs the list of moves history. 
     * History contains two arrays: 
     *  - the squares at each step
     *  - the keys of which square was selected by the players at each step
     */
    const moves = history.map((squaresAndKeys, step) => {
      // We get the key of which square was played at which step.
      const key = squaresAndKeys.keys[step - 1];
      // And then calculate the location of that square from its key.
      const location = `Col: ${getCol(key)}, Row: ${getRow(key)}`;

      const desc = step ?
        `Go to move #${step} (${location})`:
        'Go to game start';

      // TUTORIAL CHALLENGE 2: Bold the currently selected item in move list.
      /* Changes font weight so the current move is bold. */
      const fontWeight = (step === this.state.stepNumber) ? 
        {fontWeight: 'bold'} :
        {fontWeight: 'normal'}

      return (
        <li key={step}>
          <button 
            onClick = {() => this.jumpTo(step)}
            style = {fontWeight}
          >
            {desc}
          </button>
        </li>
      );
    });

    // TUTORIAL CHALLENGE 4: Toggle button to sort moves in asc/descending order
    if (this.state.movesAreReversed === true) {
      moves.reverse();
    }

    /* Button flips between whether or not moves are displayed in reverse. */
    let reverseMovesButton = <button
      onClick = {() => this.setState({
        movesAreReversed: !this.state.movesAreReversed
      })}
      >
        Reverse Moves
      </button>

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares = {current.squares}
            onClick = {(i) => this.handleClick(i)}
            winningSquares = {winningSquares} // TUTORIAL CHALLENGE 5
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{reverseMovesButton}</div>{}
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

/** Determines the winner of the Tac-Tac-Toe game, if any. 
 * (This function copied from React tutorial) 
 * I've edited it to, on win or draw, return an object with:
 *  {
 *    winner: string - the winning player or the draw,
 *    winningSquares: Array<number> - the three winning squares (if not a draw)
 *  }
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a], // They'll all be the same, 'X' or 'O',
        winningSquares: [a, b, c],
      }
    }
  }
  // TUTORIAL CHALLENGE 6: When no one wins, display a message that it's a draw.
  // The code only reaches this point if there wasn't a winner.
  if (anyEmptySquares(squares)) {
    // There are empty squares to move in. Game is still in-progress
    return null;
  } else {
    // There are no empty squares. It's a draw.
    return {
      winner: 'It\'s a draw!',
      winningSquares: [], // No winning squares
    }
  }
}

/** Checks whether the board of squares has any empty squares.
 * An empty square has the value `null`. 
 */
function anyEmptySquares(squares) {
  for (let square of squares) {
    if (square === null) {
      return true;
    }
  }
  return false;
}

// For both of these we know the squares array is 3*3 so we just write instead
// of passing in its dimensions.
/** Returns the row of the square at index i in squares array. */
function getCol(i) {
  console.log(i);
  return (i % 3);
}

/** Returns the row of the square at index i in squares array. */
function getRow(i) {
  return Math.floor(i / 3);
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
