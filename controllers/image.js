const Clarifai = require("clarifai")

const app = new Clarifai.App({
  apiKey: "9b63d7b1a1654d2e973684b2d7717f67",
})

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => {
      res.json(data)
    })
    .catch((err) => res.status(400).json("unable to work with API"))
}

const handleImage = (req, res, db) => {
  const { id } = req.body
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0])
    })
    .catch((error) => res.status(400).json("unable to get entries"))
}
//need to iterate through object of users again .. we'll refactor this into function later
//   let found = false
//   database.users.forEach((user) => {
//     if (user.id === id) {
//       found = true
//       user.entries++
//       return res.json(user.entries)
//       //if user is found .. increase count by 1 and show total number of entries
//     }
//   })
//   if (!found) {
//     res.status(400).json("not found")
//   }
// })

module.exports = {
  handleImage,
  handleApiCall,
}
