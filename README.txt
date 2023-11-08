Video Game Recommendation System
Git Hub Url: https://github.com/Coreyandres10/VideoGameRec.git
By Corey Cevallos

Video Game recommendation system: The website I built was made for gamers to input two different video games and receive several recommendations on what
video games they have played before, then they can read through and find what best fits them. There is also a home page where you can create an account, 
update your name, possibly even delete your account if you would like to. Also if no account is created it will prompt you to make an account if you havent creted one
These games are being pulled from the API IGDB(Internet game database).



Contents of Zip file:

The index.js file is the main file of the server where I have created a node js server and connected it with MongoDB, I have implemented an express session to get user login info. THen on middleware I have implmented auth middleware, which will check if the user is logged in or not. On controller folder I put all the contoller related to user and searching games. Inside the mpdel folder I implemented the model for user using mongoose. Inside view I have created all the ejs file. The Api I used was IGDB , which coorelates with twitch Dev and I used my specific key to make that part work.

Packages and technologies Used
1. **bcryptjs 
   - : A library for hashing and salting passwords to enhance security.

2. **body-parser 
   - : Middleware for parsing incoming request bodies in Express applications.

3. **connect-mongodb-session 
   - : MongoDB session store for Express applications to store session data.

4. **cors 
   - : Middleware for handling Cross-Origin Resource Sharing (CORS) in Express applications.

5. **dotenv 
   - : Loads environment variables from a `.env` file into `process.env`.

6. **ejs 
   - : Embedded JavaScript templates for rendering dynamic HTML content in Express views.

7. **express 
   - : A fast, unopinionated, minimalist web framework for Node.js, used for building web applications.

8. **express-session 
   - : Middleware for managing sessions in Express applications.

9. **mongoose 
   - : MongoDB object modeling for Node.js, providing a schema-based solution to model application data.

10. **node-fetch 
   - : A lightweight module that brings window.fetch to Node.js, allowing making HTTP requests.


Tech Stack:
-Node js
-express
-embedded javascript
-Mongodb

Run:

To install all dependencies
npm install

To run the server, you can use:
node index.js

