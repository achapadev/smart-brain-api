const express = require("express")
const bcrypt = require("bcrypt-nodejs")
const cors = require("cors")
const knex = require("knex")
const register = require("./controllers/register")
const signin = require("./controllers/signin")
const profile = require("./controllers/profile")
const image = require("./controllers/image")

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "test",
    database: "smart-brain",
  },
})

// db.select("*")
//   .from("users")
//   .then((data) => {
//     console.log(data)
//   })

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
//these are needed when sending data from the front end and we're using json - express can't read
//app.use = syntax to use middleware
app.use(cors())

// const database = {
//   //we could use a for each loop here to check against all users/pw ..main reason we use databases instead would be pain with for loop
//   //Also if we were to make change and save .. nodemon is going to refresh server .. and we'll lose any new saved users in 'database' object..this is why we use real databases :)
//   users: [
//     {
//       id: "123",
//       name: "John",
//       email: "john@gmail.com",
//       password: "cookies",
//       entries: 0,
//       Joined: new Date(),
//     },
//     {
//       id: "124",
//       name: "Sally",
//       email: "sally@gmail.com",
//       password: "bananas",
//       entries: 0,
//       joined: new Date(),
//     },
//   ],
// }

app.get("/", (req, res) => {
  res.send(database.users)
  //return list of users we have in database object
})

app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt)
})
//new user will be created via this route
app.post("/register", (req, res) => {
  // this is what we call dependecy injection
  register.handleRegister(req, res, db, bcrypt)
})

app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db)
})
//everytime user enters an image we want to update their count of entries
app.put("/image", (req, res) => {
  image.handleImage(req, res, db)
})

app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res)
})
app.listen(3000, () => {
  console.log("app is running on port 3000")
})

/*
/ --> res = this is working
/signin --> POST  = success/fail (we want to send inside of body over https so that pw is hidden over man in middle attacks)
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
test all these routes using POSTMAN
*/
