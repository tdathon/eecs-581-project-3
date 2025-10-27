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

## Class UML Diagram
<img width="919" height="740" alt="Screenshot 2025-10-26 at 7 30 47 PM" src="https://github.com/user-attachments/assets/0df7801e-c3f2-4633-b688-6a681ecc7a0a" />
