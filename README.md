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
## HTML Deliverable
Drafted the HTML for the application.
- **HTML Pages** - Four HTML pages, for generating mazes, logging in, creating an account, and viewing saved mazes
- **Links** - Every page links back to the page for generating mazes, but navigation to the saved mazes and account pages are controlled by button, to redirect from saved mazes to logging in if the user isn't logged in, so the button is not yet impemented
- **Text** - All neccessary text is included to instruct the user on how to use the application
- **Images** - Mazes will be drawn in a svg, which hasn't been implemented yet, so images are blank for now
- **DB/Login** - Login page had text boxes for entering user informationm and a login button. Mazes displayed on the main page come from database, as well as those in the Saved Mazes page.
- **WebSocket** - As mazes are saved, the latest saved mazes from all users are shown on the home page.
## CSS Deliveralbe
Drafted styling of the HTML using CSS. Styling may change subtly as more features are implemented to better accomodate them.
- **Header, Footer & Main** all have consistent styling accross the four pages
- **Navigation Elements / Links** are consistentely underlined and surrounded with a bubble of whitespace
- **Reponds to Resizing the Window** by changing flex direction
- **Elements** have a bright color scheme and rounded edges, buttons change color slightly when hovered over
- **Text** is a consistent font and is a lighter color on darker backgrounds
- **Images** - for now the svg's just have a border, more styling will come once I know what rendered mazes will look like
## JavaScript Deliverable
Added JavaScript for maze generation, page navigation, logging in and creating an account, and viewing saved mazes.
- **Login/Account Creation** - After logging in, the username displays in the header. When trying to view saved mazes, redirects to login page if not logged in.
- **Database** - Saved mazes are stored in sessionStorage temporarily. Can be viewed on the Saved Mazes page.
- **WebSocket** - The latest locally saved mazes are displayed in the latest saved mazes temporarily.
- **Application Logic** - Mazes are generated according to the requested size.
## Service Deliverable
Added backend endpoints to receive mazes to save and return the list of saved mazes.
- **Node.js/Express HTTP service** - Done
- **Static Middleware for Frontend** - Done
- **Calls to Third Part Endpoints** - Added a quote to the footer using the same third party endpoints as simon.
- **Backend Service Endpoints** - For now stores only one list of saved mazes without differentiating between users. Has endpoints for saving mazes and retrieving the list of saved mazes.
- **Frontend calls Servide Endpoints** - Frontend uses fetch to save mazes and retrieve the list of saved mazes. Uses seesionStorage as a backup in case the request fails.
