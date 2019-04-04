const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const path = require('path')
const models = require('./models')
const app = express()


let posts = []

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
    models.Post.findAll().then((posts) => {
        console.log(posts)
        res.render('view-all', { posts: posts })
    })
})
app.get('/', (req, res) => {
    res.redirect('view-all')
})

// adding a post
app.get('/add-post', (req, res) => {
    res.render('add-post')
})

app.post('/add-post', (req, res) => {
    let title = req.body.title
    let body = req.body.body
    let category = req.body.category

    let post = models.Post.build({
        title: title,
        body: body,
        category: category
    })
    // save the post to the database
    post.save().then((savedPost) => {
        console.log(savedPost)
    }).then(() => {
        res.redirect('/')
    })

})

app.post('/delete-post', (req, res) => {
    deleteID = req.body.id
    models.Post.destroy({
        where: {
            id: deleteID
        }
    }).then(() => {
        res.redirect('/')
    })
})

app.get('/update-post/:id', (req, res) => {
    let updateID = parseInt(req.params.id)
    models.Post.findOne({
        where: {
            id: updateID
        }
    }).then((post) => {
        res.render('update-post', { post: post })
    })
    // res.render('update-post', { updateID: updateID })
})

app.post('/update-post', (req, res) => {
    let title = req.body.title
    let category = req.body.category
    let body = req.body.body
    let updateID = req.body.id
    models.Post.update({
        title: title,
        category: category,
        body: body
    }, {
            where: {
                id: updateID
            }
        }).then(() => {
            res.redirect('/')
        })
})

app.get('/filter-posts', (req, res) => {
    res.render('filter-posts')
})

app.post('/filter-posts', (req, res) => {
    let category = req.body.category
    models.Post.findAll({
        where: {
            category: category
        }
    }).then((posts) => {
        res.render('view-all', { posts: posts })
    })
})

app.get('/comments/:id', (req, res) => {
    let postID = parseInt(req.params.id)
    //Code here
    // res.render('comments', { postID })
    models.Post.findByPk(postID, {
        include: [{
            model: models.Comment,
            as: 'comments'
        }]
    }).then((post) => {
        console.log(post.comments)
        res.render('comments', { post: post })
    })
})
app.post('/add-comment/:id', (req, res) => {
    let title = req.body.title
    let body = req.body.body
    let id = req.body.id
    let comment = models.Comment.build(
        {
            title: title,
            body: body,
            postid: id
        }
    )
    comment.save().then((savedComment) => {
        console.log(savedComment)
    }).then(() => {
        res.redirect('/comments/' + id)
    })

})


app.listen(3000, () => {
    console.log("Server is listening...")
})