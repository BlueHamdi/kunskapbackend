const express = require("express")
const app = express()
const cors = require('cors')
const db = require("./database.js")

app.use(cors())
app.use(express.static('public'))

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
            res.status(400).json({"error":err.message});
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

 */