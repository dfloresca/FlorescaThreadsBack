const express = require('express');
const router = express.Router();
//import the comment Model
const { Comment } = require('../models')

// Creating routes that allow us to
// 1. return an array of objects [{}, {}, {}]
// 2. return a comment based on ObjectId
// 3. return a comment based on a search input
// 4. create a comment and return an object of the new comment
// 5. update a comment by the objectId
// 6. remove a comment and return back to all comments

//-------------------------------------
// GET /comments - return all comments
//-------------------------------------
router.get('/', (req, res) => {
    Comment.find({})
        .then(comments => {
            console.log('--- all comments---\n', comments)
            return res.json(comments)
        })
        .catch(error => {
            console.log('---error---\n', error)
            return res.status(500).json({ error: 'internal server error' })
        })
})

//-------------------------------------
// GET /comments/search - return one comment by search query 
//-------------------------------------
router.get('/search', (req, res) => {
    // Construct a query object based on req.query
    let queryObject = {};
    if (req.query.userName) {
        queryObject.userName = req.query.userName;
    }
    if (req.query.comment) {
        queryObject.comment = req.query.comment;
    }
    
    // Use the query object in the MongoDB query with findOne
    Comment.findOne(queryObject)
        .then(comment => {
            if (!comment) {
                return res.status(404).send('No comment found matching the criteria.');
            }

            res.json(comment);
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        });
});
//-------------------------------------
// GET /comments/:id - return one comment by ObjectId
//-------------------------------------
router.get('/:id', (req, res) => {
    Comment.findById(req.params.id)
        .then(comment => {
            console.log('--- comments search by ObjectId--- \n', comment)
            return res.json(comment)
        })
        .catch(error => {
            console.log('---- read by id error ---\n', error)
            return res.status(404).json({ message: "No comment with this ID" })
        })
})

//-------------------------------------
// POST /comments/new - create new comment and return new comment 
//-------------------------------------
router.post('/new', (req, res) => {
    Comment.create({
        userName: req.body.userName,
        comment: req.body.comment,
        
    })
        .then(result => {
            Comment.findById(result._id)
                .then(comment => {
                    return res.json(comment)
                })
                .catch(error => {
                    return res.status(404).json({ message: 'error making comment' })
                })
        })
})

//-------------------------------------
// PUT /comment/:id - update comment by using objectId 
//-------------------------------------
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const updatedCommentData = req.body;

    Comment.findByIdAndUpdate(id, updatedCommentData, { new: true })
        .then(updatedComment => {
            if (!updatedComment) {
                return res.status(404).json({ error: 'Comment not found' });
            }
            res.json(updatedComment);
        })
        .catch(error => {
            console.error('Error updating Comment by ID:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
//-------------------------------------
// DELETE /comments/:id - remove comment by using ObjectId
//return back all comments
//-------------------------------------
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Comment.findByIdAndDelete(id)
        .then(result => {
            console.log('---remove comment  by ObjectId --- \n', result)
            return res.status(200).json({ message: `Remove ${id} from database` })
        }) 
        .catch(error => {
            console.log(`Failed to delete comment with id= ${id}`, error);
            return res.status(500).json({ error: "server Error"})
        })
})


module.exports = router;