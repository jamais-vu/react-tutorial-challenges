# React tutorial challenges 

At the end of the [React.js tutorial](https://reactjs.org/tutorial/tutorial.html#wrapping-up) there are six challenges, which I've completed to get up-to-speed on React.

> If you have extra time or want to practice your new React skills, here are some ideas for improvements that you could make to the tic-tac-toe game which are listed in order of increasing difficulty:

I've described my solution to each, and they're also marked in my code, where possible.

> 1. Display the location for each move in the format (col, row) in the move history list.

In `Game.state.history` I added an array which records the indices of 
which squares were selected at each turn. This is then used in `Game.render()` 
to determine the column and row of each square when we construct the move history 
list.

```JSX
// in Game.render()

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
// ...
```

> 2. Bold the currently selected item in the move list.

In the `Game.render()` method, when the `moves` list is constructed, I 
added a ternary operator which checks if the move was at current step,
and if so sets its font weight to bold.

```JSX
// in Game.render()
// ...

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
// ...
```

> 3. Rewrite Board to use two loops to make the squares instead of hardcoding them.

This was the only tricky one. I couldn't figure out how to generate JSX in 
nested loops, and wasn't familiar with how React keys worked, so I had to 
reference a lot of examples and didn't really figure it out all on my own.

```JSX
class Board extends React.Component {
  // ...other Board methods

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
```

> 4. Add a toggle button that lets you sort the moves in either ascending or descending order.

I added a `movesAreReversed` property to `Game`'s `state`, and a button
which flips this between `true` and `false`. I added a conditional in 
`Game.render()` which reverses the order of `moves`, if true.

```JSX
// in Game.render()
// ...
/* Button flips between whether or not moves are displayed in reverse. */
let reverseMovesButton = <button
  onClick = {() => this.setState({
    movesAreReversed: !this.state.movesAreReversed
  })}>
    Reverse Moves
  </button>
//...
```

> 5. When someone wins, highlight the three squares that caused the win.

I return the winning squares from `calculateWinner`, and these are passed 
on to `Board`, which uses them to determine whether to color each square
it renders yellow (winning) or white (not winning).

```JSX
class Board extends React.Component {
  renderSquare(i) {
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

  //... other Board methods

}
```

> 6. When no one wins, display a message about the result being a draw.

In the `calculateWinner` function, if there's no winner, it checks whether
there are empty squares left. If there are no more empty squares, it's 
a draw.

```JSX
function calculateWinner(squares) {
  // ...code to check for winner, given by React tutorial.
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
```