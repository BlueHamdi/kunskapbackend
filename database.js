const sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "kunskapsvarvet.db"


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQlite database.')
        db.run(`CREATE TABLE USER (
            UserId INTEGER PRIMARY KEY,
            Username TEXT,
            UserPassword TEXT,
            UserEmail TEXT,
            UserSchool TEXT,
            UserGrade TEXT
        );`,(err) => {
        if (err) {
            // Table already created
        }else{
            // Table just created, creating some rows
            let insert = 'INSERT INTO User (Username, UserPassword, UserEmail, UserSchool, UserGrade) VALUES (?,?,?,?,?)'
            db.run(insert, ["Hamdi", "123", "Hamdi@gmail.com", "Newton", "2"])
        }
    })  
    }
})


module.exports = db