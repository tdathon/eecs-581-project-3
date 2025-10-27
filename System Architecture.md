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
  These requires each cell to have a relation with its neighboring cells. A cell on the boarder of the grid considers any empty neighboring spots to be dead for the purpose of executing game rules. In future designs we may create an infinite game board, which will require major architectural changes.  
<img width="668" height="398" alt="image" src="https://github.com/user-attachments/assets/e46f3be6-2b1c-4a6d-88c1-da1c2fd32378" />  
  Conway's game of life does not have an objective or way to win, but instead serves to amuse its user through the natural and deterministic evolution of the game board. The game is deterministic, meaning the same input state will result in the same output state each time.  
  Internally, our system works by creating an array of cells that presents as the board. Each cell has the ability to be toggled between its alive and dead state by the user. The user can make any changes to the board desired, then choose to proceed to the next generation. We additionally added the ability to press a play button and let the board progress to the next generation after a short time interval. A user may interact with the game board even after it advances generations. Howewver, each advancement of generation is considered atomic, so a user is unable to change the game board while it is in the process of applying the rules. This protects the principal that the rules must be applied to every cell simultaneously.  
  When a user chooses to advance a generation, our program creates a new grid and applies the rules for cell generation according to the previous state. When this new grid is generated, it will then replace the game board with the new grid. We then update the user interface to present them with the new game board.  
<img width="1298" height="698" alt="image" src="https://github.com/user-attachments/assets/f11f90e0-0e7b-4a85-ad9d-2a3b576c3b49" />  

A complete UML Diagram of our program with specific function and class names is as follows:  
<img width="919" height="740" alt="Screenshot 2025-10-26 at 7 30 47 PM" src="https://github.com/user-attachments/assets/0df7801e-c3f2-4633-b688-6a681ecc7a0a" />  
