const express = require('express');
const router = express.Router();
//import the post Model
const { Post } = require('../models')

// Creating routes that allow us to
// 1. return an array of objects [{}, {}, {}]
// 2. return a post based on ObjectId
// 3. return a post based on a search input
// 4. create a post and return an object of the new post
// 5. update a post by the objectId
// 6. remove a post and return back to all posts

//-------------------------------------
// GET /users - return all posts
//-------------------------------------
router.get('/', (req, res) => {
    Post.find({})
        .then(posts => {
            console.log('--- all posts---\n', posts)
            return res.json(posts)
        })
        .catch(error => {
            console.log('---error---\n', error)
            return res.status(500).json({ error: 'internal server error' })
        })
})

//-------------------------------------
// GET /posts/search - return one post by search query 
//-------------------------------------
router.get('/search', (req, res) => {
    // Construct a query object based on req.query
    let queryObject = {};
    if (req.query.title) {
        queryObject.title = req.query.title;
    }
    if (req.query.post) {
        queryObject.post = req.query.post;
    }
    if (req.query.image) {
        queryObject.image = req.query.image;
    }
    if (req.query.publishDate) {
        queryObject.publishDate = req.query.publishDate;
    }
    if (req.query.comments) {
        queryObject.comments = req.query.comments;
    }
    if (req.query.like) {
        queryObject.like = req.query.like;
    }
    
    // Use the query object in the MongoDB query with findOne
    Post.findOne(queryObject)
        .then(post => {
            if (!post) {
                return res.status(404).send('No post found matching the criteria.');
            }

            res.json(post);
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        });
});
//-------------------------------------
// GET /posts/:id - return one post by ObjectId
//-------------------------------------
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            console.log('--- posts search by ObjectId--- \n', post)
            return res.json(post)
        })
        .catch(error => {
            console.log('---- read by id error ---\n', error)
            return res.status(404).json({ message: "No post with this ID" })
        })
})

//-------------------------------------
// POST /posts/new - create new post and return new post
//-------------------------------------
router.post('/new', (req, res) => {
    Post.create({
        title: req.body.title,
        post: req.body.post,
        image: req.body.image,
        publishDate: req.body.publishDate,
        comments: req.body.comments,
        like: req.body.like,
        
    })
        .then(result => {
            Post.findById(result._id)
                .then(post => {
                    return res.json(post)
                })
                .catch(error => {
                    return res.status(404).json({ message: 'error making post' })
                })
        })
})

//-------------------------------------
// PUT /posts/:id - update post by using objectId 
//-------------------------------------
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const updatedPostData = req.body;

    Post.findByIdAndUpdate(id, updatedPostData, { new: true })
        .then(updatedPost => {
            if (!updatedPost) {
                return res.status(404).json({ error: 'Post not found' });
            }
            res.json(updatedPost);
        })
        .catch(error => {
            console.error('Error updating Post by ID:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
//-------------------------------------
// DELETE /posts/:id - remove post by using ObjectId
//return back all posts
//-------------------------------------
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Post.findByIdAndDelete(id)
        .then(result => {
            console.log('---remove post by ObjectId --- \n', result)
            return res.status(200).json({ message: `Remove ${id} from database` })
        }) 
        .catch(error => {
            console.log(`Failed to delete post with id= ${id}`, error);
            return res.status(500).json({ error: "server Error"})
        })
})


module.exports = router;