# React tutorial challenges 

At the end of the [React.js tutorial](https://reactjs.org/tutorial/tutorial.html#wrapping-up) there are six challenges, which I've completed to get up-to-speed on React.

> If you have extra time or want to practice your new React skills, here are some ideas for improvements that you could make to the tic-tac-toe game which are listed in order of increasing difficulty:

I've described my solution to each, and they're also marked in my code, where possible.

> 1. Display the location for each move in the format (col, row) in the move history list.

In `Game.state.history` I added an array which records the indices of 
which squares were selected at each turn. This is then used to determine 
the column and row of each square when we construct the move history list.

> 2. Bold the currently selected item in the move list.

In the `Game.render()` method, when the `moves` list is constructed, I 
added a ternary operator which checks if the move was at current step,
and if so sets its font weight to bold.

```JSX
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
```

> 3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
> 4. Add a toggle button that lets you sort the moves in either ascending or descending order.
> 5. When someone wins, highlight the three squares that caused the win.
> 6. When no one wins, display a message about the result being a draw.

My solutions:

1. 

2.

3. This was the only tricky one, I had to look up how to do JSX in loops, and
   wasn't familiar with how React keys worked. So I didn't really figure it 
   out on my own.

4. I added a `movesAreReversed` property to Board's `state`, and a button
   which flips this between `true` and `false`. I added a conditional in 
   Board's `render` method which reverses the order of `moves`, if true.

5. I return the winning squares from `calculateWinner`, and these are passed 
   on to `Board``, which uses them to determine whether to color each square
   it renders yellow (winning) or white (not winning).

6. In the `calculateWinner` function, if there's no winner, it checks whether
   there are empty squares left. If there are no more empty squares, it's 
   a draw.