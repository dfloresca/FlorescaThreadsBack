const express = require('express');
const router = express.Router();
//import the messages Model
const { Message } = require('../models')

// Creating routes that allow us to
// 1. return an array of objects [{}, {}, {}]
// 2. return a message based on ObjectId
// 3. return a messsage based on a search input
// 4. create a message and return an object of the new message
// 5. update a message by the objectId
// 6. remove a message and return back to all messages

//-------------------------------------
// GET /messages - return all messages
//-------------------------------------
router.get('/', (req, res) => {
    Message.find({})
        .then(messages => {
            console.log('--- all users---\n', messages)
            return res.json(messages)
        })
        .catch(error => {
            console.log('---error---\n', error)
            return res.status(500).json({ error: 'internal server error' })
        })
})

//-------------------------------------
// GET /messages/search - return one message by search query 
//-------------------------------------
router.get('/search', (req, res) => {
    // Construct a query object based on req.query
    let queryObject = {};
    if (req.query.userName) {
        queryObject.userName = req.query.userName;
    }
    if (req.query.fullName) {
        queryObject.fullName = req.query.fullName;
    }
    if (req.query.email) {
        queryObject.email = req.query.email;
    }
    if (req.query.subject) {
        queryObject.subject = req.query.subject;
    }
    if (req.query.message) {
        queryObject.message = req.query.message;
    }
    
    // Use the query object in the MongoDB query with findOne
    Message.findOne(queryObject)
        .then(message => {
            if (!message) {
                return res.status(404).send('No messages found matching the criteria.');
            }

            res.json(message);
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        });
});
//-------------------------------------
// GET /messages/:id - return one message by ObjectId
//-------------------------------------
router.get('/:id', (req, res) => {
    Message.findById(req.params.id)
        .then(message => {
            console.log('--- messages search by ObjectId--- \n', message)
            return res.json(message)
        })
        .catch(error => {
            console.log('---- read by id error ---\n', error)
            return res.status(404).json({ message: "No message with this ID" })
        })
})

//-------------------------------------
// POST /messages/new - create new message and return new message 
//-------------------------------------
router.post('/new', (req, res) => {
    Message.create({
        userName: req.body.userName,
        fullName: req.body.fullName,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message,
        
        
    })
        .then(result => {
            Message.findById(result._id)
                .then(message => {
                    return res.json(message)
                })
                .catch(error => {
                    return res.status(404).json({ message: 'error making message' })
                })
        })
})

//-------------------------------------
// PUT /messages/:id - update message by using objectId // 
//-------------------------------------
// router.put('/:id', (req, res) => {
//     const id = req.params.id;
//     const updatedMessageData = req.body;

//     Message.findByIdAndUpdate(id, updatedMessageData, { new: true })
//         .then(updatedMessage => {
//             if (!updatedMessage) {
//                 return res.status(404).json({ error: 'Message not found' });
//             }
//             res.json(updatedMessage);
//         })
//         .catch(error => {
//             console.error('Error updating Message by ID:', error);
//             res.status(500).json({ error: 'Internal Server Error' });
//         });
// });

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const updatedMessageData = req.body;

    Message.findByIdAndUpdate(id, updatedMessageData, { new: true })
        .then(updatedMessage => {
            if (!updatedMessage) {
                return res.status(404).json({ error: 'Message not found' });
            }
            res.json(updatedMessage);
        })
        .catch(error => {
            console.error('Error updating Message by ID:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
//-------------------------------------
// DELETE /messages/:id - remove message by using ObjectId
//return back all messages
//-------------------------------------
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Message.findByIdAndDelete(id)
        .then(result => {
            console.log('---remove message by ObjectId --- \n', result)
            return res.status(200).json({ message: `Remove ${id} from database` })
        }) 
        .catch(error => {
            console.log(`Failed to delete message with id= ${id}`, error);
            return res.status(500).json({ error: "server Error"})
        })
})


module.exports = router;