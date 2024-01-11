# Web Maze Generator
## Design Deliverable
### Elevator Pitch / Description
Do you ever randomly want the satisfaction of solving a maze, but lack a convenient maze nearby? Web Maze Generator provides an online service that allows creating mazes of arbitrary size, viewing their solution, and saving them to an account to review them later.
### Design
#### Main Page
![Main Page Design](/layout/WebMazeGeneratorMainPage.png)
#### Saved Mazes Page
![Saved Mazes Design](/layout/WebMazeGeneratorSavedPage.png)
#### Login Page
![Login Page Design](/layout/WebMazeGeneratorLoginPage.png)
#### Create Account Page
![Create Account Design](/layout/WebMazeGeneratorCreateAccountPage.png)
### Key Features
- HTTPS to login safely
- Choose a maze size
- View the solution of a generated maze
- View the last 3 mazes to be saved across all users
- Save generate mazes
- View all saved mazes with their widths and heights
- Delete previously saved mazes
### Technologies
- **HTML** - 4 HTML pages: generating mazes, logging in, creating an account, and viewing mazes saved to an account
- **CSS** - Consistent styling that is neat and orderly, and is compatible with varying screens
- **JavaScript** - Generates mazes, handles logging in. Probably also handle rendering mazes
- **Service** - Used to login, get saved mazes, save new mazes
- **DB/Login** - Store accounts and saved mazes
- **WebSocket** - The last three mazes to be saved are tracked by the server and clients are updated whenever a new maze is saved
- **React** - eventually rework things to use React
