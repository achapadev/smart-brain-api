const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body
  if (!email || !name || !password) {
    return res.status(400).json("incorrect form submission")
  }
  const hash = bcrypt.hashSync(password)
  //we made db communicate w/ server and registere first user
  //below we first update the login table, get the loginEmail, and to make sure both are part of transaction we use trx object
  db.transaction((trx) => {
    // create a transaction when you have to do more than 2 things at once
    // we inserted into login, returned email, used loginEmail to return another trx transaction
    //  to insert into users and respond w/ json, in order for this to be added we have to commit and in case anything fails
    //  we roll back the changes
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({ email: loginEmail[0], name: name, joined: new Date() })
          .then((user) => {
            res.json(user[0])
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
  }).catch((err) => res.status(400).json("unable to register"))
}
// database.users.push({
//   id: "125",
//   name: name,
//   email: email,
//   entries: 0,
//   joined: new Date(),
// })
//always rememeber to include response, will be new user that is created .. perhaps to display it in profile page (expression gets us last user added)

module.exports = {
  handleRegister: handleRegister,
}
