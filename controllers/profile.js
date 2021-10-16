const handleProfileGet = (req, res, db) => {
  //using this syntax above we can put in anything after profile/ to trigger it and can grab id through request.params property
  const { id } = req.params
  db.select("*")
    .from("users")
    .where({ id: id })
    .then((user) => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json("Not found")
      }
    })
    .catch((err) => res.status(400).json("error getting user"))
  // we want to loop through users and find user w/ matching id that was entered
  // database.users.forEach((user) => {
  //   if (user.id === id) {
  //     found = true
  //     return res.json(user)
  //   }
  // })
  // if (!found) {
  //   res.status(400).json("not found")
  // }
}

module.exports = {
  handleProfileGet,
}
