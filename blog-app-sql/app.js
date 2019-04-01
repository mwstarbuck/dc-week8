const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const pgp = require('pg-promise')()
const path = require('path')
const app = express()

// configuring the database using pg-promise
const connectionSting = "postgres://localhost:5432/blogdb"
const db = pgp(connectionSting)

// console.log(db)

app.use(bodyParser.urlencoded({ extended: false }))
// tell express to use mustache templating engine
app.engine('mustache', mustacheExpress())

// the pages are located in views directory
app.set('views', './views')

//extension will be mustache for html pages
app.set('view engine', 'mustache')

// get the path to the views folder
const VIEWS_PATH = path.join(__dirname, '/views')

// telling mustache where to find partial pages
app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'))


app.get('/view-all', (req, res) => {
    db.any('SELECT id, title, body FROM posts;')
        .then((posts) => {
            res.render('view-all', { posts: posts })
        })
})

app.get('/', (req, res) => {
    res.redirect('view-all')
})

app.get('/add-post', (req, res) => {
    res.render('add-post')
})
app.post('/add-post', (req, res) => {
    let title = req.body.title
    let body = req.body.body

    db.one('INSERT INTO posts(title, body) VALUES($1, $2) RETURNING id;', [title, body])
        .then((data) => {
            console.log(data)
            console.log("SUCCESSFUL POST")
        }).catch(error => console.log(error))
    res.send("SUCCESSFUL POST")
})

app.post('/delete-post', (req, res) => {
    let postID = parseInt(req.body.id)

    db.none('DELETE FROM posts WHERE id = $1', [postID])
        .then(() => {
            res.redirect('view-all')
        })
})

app.get('/update-post/:id', (req, res) => {
    let updateID = parseInt(req.params.id)
    res.render('update-post', { updateID: updateID })
})
// app.get('/update-post', (req, res) => {
//     let updateID = parseInt(req.body.id)
//     res.render('update-post', { updateID: updateID })
// })


app.post('/update-post', (req, res) => {
    let title = req.body.title
    let body = req.body.body
    let updateID = parseInt(req.body.id)
    db.none('UPDATE posts SET title = $1, body = $2 WHERE id = $3', [title, body, updateID])
        .then(() => {
            res.redirect('/view-all')
        })
})

app.listen(3000, () => {
    console.log("Server is listening...")
})