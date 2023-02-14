    const express = require("express")
    const app = express()
    const cors = require('cors')
    const db = require("./database.js")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const rateLimit = require("express-rate-limit");


    app.use(cors())
    const bodyParser = require("body-parser")
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    const port = 8000

    // Start server
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
    app.get("/api/user", (req, res, next) => {

        let sql = "select * from User"
        let params = []
        db.all(sql, params, (err, rows) => {
            if (err) {
                res.status(400).json({"error":err.message});
                return;
            }
            res.json({
                "message":"success",
                "User":rows
            })
        })
    })
    app.put("/api/user/:id", (req, res, next) => {
      if (!req.body.UserScore) {
          res.status(400).json({"error": "UserScore is required"});
          return;
      }
  
      let sql = "UPDATE User SET UserScore = ? WHERE UserId = ? and UserScore > ?"
      let params = [req.body.UserScore, req.params.id, req.body.UserScore]
      db.run(sql, params, function (err, result) {
          if (err) {
              res.status(400).json({"error":err.message});
              return;
          }
          res.json({
              "message": "success",
              "data": result
          })
      });
  });
const SECRET = "your_secret_key"; // replace with your own secret key

// Create rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many login attempts, please try again later"
});

app.post('/login', loginLimiter, (req, res) => {
  const { username, password } = req.body;

  // Check if the username exists in the database
  db.get(
    "SELECT `UserPassword`, `UserId` FROM `users` WHERE `UserName` = ?",
    [username],
    (err, row) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
        return;
      } 
    }
  );

      if (!row) {
        // User not found
        res.json({ success: false, message: 'Incorrect username or password' });
        return;
      }

      // Compare the password with the hashed password in the database
      bcrypt.compare(password, row.UserPassword, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ success: false, message: 'Server error' });
          return;
        }

        if (result) {
          // Login successful
          // Create JWT
          const payload = {
            userId: row.UserId,
            username: username,
            exp: Math.floor(Date.now() / 1000) + (60 * 60) // expires in 1 hour
          };
          const token = jwt.sign(payload, SECRET);
          res.json({ success: true, token });
        } else {
          // Login failed
          res.json({ success: false, message: 'Incorrect username or password' });
        }
      });
    }
  );
;





app.get("/api/contact", (req, res, next) => {

    let sql1 = "select * from Contact"
    let params = []
    db.all(sql1, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "Contact":rows
        })
    })
})
/* app.get("/api/bookcategory/:cat", (req, res, next) => {
    let sql = "select * from book where bookCategory = ?"
    let params = [req.params.cat]
    db.all(sql, params, (err, rows) => {
        if (err) {
            rses.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "book":rows
        })
    })
}) */

/* app.get("/api/books/:id", (req, res, next) => {
    let sql = "select * from book where bookId = ?"
    let params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "book":row
        })
    })
})


app.post("/api/books", (req, res, next) => {
    let data = {
        bookTitle: req.body.bookTitle,
        bookAuthor: req.body.bookAuthor,
        bookIsbn: req.body.bookIsbn,
        bookText: req.body.bookText,
        bookCategory: req.body.bookCategory
    }
    let sql ='INSERT INTO book (bookTitle, bookAuthor, bookIsbn, bookText, bookCategory) VALUES (?,?,?,?,?)'
    let params =[data.bookTitle, data.bookAuthor, data.bookIsbn, data.bookText, data.bookCategory]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "book": data,
            "id" : this.lastID
        })
    })
})

app.put("/api/books", (req, res, next) => {
    let data = {
            bookTitle: req.body.bookTitle,
            bookAuthor: req.body.bookAuthor,
            bookIsbn: req.body.bookIsbn,
            bookText: req.body.bookText,
            bookCategory: req.body.bookCategory


    }
    let sql ='UPDATE book SET bookTitle = ?, bookAuthor = ?, bookIsbn = ?, bookText = ?, bookCategory=? WHERE bookId = ?'
    let params =[data.bookTitle, data.bookAuthor, data.bookIsbn, data.bookText, data.bookCategory]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "book": data,
            "id" : this.lastID
        })
    })
})

app.delete("/api/books", (req, res, next) => {
    db.run(
        'DELETE FROM book WHERE bookId = ?',
        req.body.bookId,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", rows: this.changes})
        })
})

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require("express-rate-limit");
const { db } = require('./database');

const app = express();
app.use(express.json());

const SECRET = "your_secret_key"; // replace with your own secret key

// Create rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many login attempts, please try again later"
});

app.post('/login', loginLimiter, (req, res) => {
  const { username, password } = req.body;

  // Check if the username exists in the database
  db.get(
    SELECT UserPassword, UserId FROM users WHERE UserName = ?,
    [username],
    (err, row) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
        return;
      }

      if (!row) {
        // User not found
        res.json({ success: false, message: 'Incorrect username or password' });
        return;
      }

      // Compare the password with the hashed password in the database
      bcrypt.compare(password, row.UserPassword, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ success: false, message: 'Server error' });
          return;
        }

        if (result) {
          // Login successful
          // Create JWT
          const payload = {
            userId: row.UserId,
            username: username,
            exp: Math.floor(Date.now() / 1000) + (60 * 60) // expires in 1 hour
          };
          const token = jwt.sign(payload, SECRET);
          res.json({ success: true, token });
        } else {
          // Login failed
          res.json({ success: false, message: 'Incorrect username or password' });
        }
      });
    }
  );
});


 */