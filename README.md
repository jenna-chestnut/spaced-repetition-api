# Ehl - Spaced Repetition API
## Learn new French words, with the spaced repetition technique! 

---

Ehl is an app created to demonstrate a possible platform for learning new words in a specified language. 

Learners start with a word, and the more often they correctly guess the translation, the less often they will see that word. If they guess incorrectly, the word will begin to show itself more frequently.

This is accomplished using a linked list data structure and spaced repetition in the server-side app. COnditional rendering on the client shows the results of their guess, scores, and the correct translation (or next word, if they have guess correctly!)


 --- 

### Tech stack  
This server-side app was created with:    
<img align="left" alt="Visual Studio Code" width="26px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/visual-studio-code/visual-studio-code.png" />
<img align="left" alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
<img align="left" alt="NodeJS" src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" />
<img align="left" alt="ExpressJS" src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" />
<img align="left" alt="Heroku" src="https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white" />
<img align="left" alt="Git" width="26px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/git/git.png" />
<img align="left" alt="GitHub" width="26px" src="https://raw.githubusercontent.com/github/explore/78df643247d429f6cc873026c0622819ad797942/topics/github/github.png" />  

<br/>

---

### Endpoints Tree
**App🔻**     

➖**MiddleWare Used🔻**   
➖➖*Auth-Router w JWT*  
➖➖*Check for User Language Function*

➖**Routes🔻**    
➖**BASE URL: /api**   

➖➖*/language*
(GET) - get all words and user's designated language details
➖➖➖*/language/head*    
(GET) - get user's next word to practice

➖➖*/language/guess* 
(POST) - submit user's guess and respond with results, total score, and next word
  
  
## Available Scripts  
  
In the project directory, you can run:  
  
`npm start`  
  
The page will reload if you make edits.\
You will also see any lint errors in the console.

`npm run cypress:open` -> run in a seperate terminal

Launches the test runner in an interactive watch mode. You must have the server running on the client app using `npm start` prior to testing.

`npm run dev`

Runs the app through a development server.

`npm run migrate`

Migrate tables in local database

`npm run migrate:test`

Migrate tables in local test database

`heroku create` to create remote server (will need heroku account - see this link for info https://devcenter.heroku.com/categories/command-line)    
`npm run deploy`  to:
  
- Run NPM audit  
- Migrate tables in production server
- Push latest commit to Heroku main branch of created app