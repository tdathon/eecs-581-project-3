## TEAM 9
### Game of Life

Synopsis: We are creating a simulation of [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life). 

## Architecture Description
  Conway's Game of Life is a simple grid based game that simulates board states according to a small set of rules. Every cell on the board is considered dead or alive. When the game progresses to the next state, a set of rules is applied to every cell simultaneously.
  The rules are:
  - Any live cell with fewer than two live neighbours dies, as if by underpopulation.
  - Any live cell with two or three live neighbours lives on to the next generation.
  - Any live cell with more than three live neighbours dies, as if by overpopulation.
  - Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
