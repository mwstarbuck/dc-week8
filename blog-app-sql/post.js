class Post {
    constructor(id, title, body) {
        this.id = id
        this.title = title
        this.body = body,
            this.comments = []
    }
    addComment(comment) {
        this.comments.push(comment)
    }
}