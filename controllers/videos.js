const express = require('express');
const router = express.Router();
//import the Video Model
const { Video } = require('../models')

// Creating routes that allow us to
// 1. return an array of objects [{}, {}, {}]
// 2. return a video based on ObjectId
// 3. return a video based on a search input
// 4. create a video and return an object of the new video
// 5. update a video by the objectId
// 6. remove a video and return back to all videos

//-------------------------------------
// GET /videos - return all videos
//-------------------------------------
router.get('/', (req, res) => {
    Video.find({})
        .then(videos => {
            console.log('--- all videos---\n', videos)
            return res.json(videos)
        })
        .catch(error => {
            console.log('---error---\n', error)
            return res.status(500).json({ error: 'internal server error' })
        })
})


//-------------------------------------
// GET /videos/search - return one video by search query //daniel
//-------------------------------------
router.get('/search', (req, res) => {
    // Construct a query object based on req.query
    let queryObject = {};
    if (req.query.title) {
        queryObject.title = req.query.title;
    }
    if (req.query.artist) {
        queryObject.artist = req.query.artist;
    }
    if (req.query.releaseYear) {
        queryObject.releaseYear = req.query.releaseYear;
    }
    if (req.query.genre) {
        queryObject.genre = req.query.genre;
    }
    if (req.query.length) {
        queryObject.length = req.query.length;
    }
    if (req.query.rating) {
        queryObject.rating = req.query.rating;
    }

    // Use the query object in the MongoDB query with findOne
    Video.findOne(queryObject)
        .then(video => {
            if (!video) {
                return res.status(404).send('No video found matching the criteria.');
            }

            res.json(video);
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        });
});
//-------------------------------------
// GET /videos/:id - return one video by ObjectId
//-------------------------------------
router.get('/:id', (req, res) => {
    Video.findById(req.params.id)
        .then(video => {
            console.log('--- videos search by ObjectId--- \n', video)
            return res.json(video)
        })
        .catch(error => {
            console.log('---- read by id error ---\n', error)
            return res.status(404).json({ message: "No video with this ID" })
        })
})

//-------------------------------------
// POST /videos/new - create new video and return new video // abby
//-------------------------------------
router.post('/new', (req, res) => {
    Video.create({
        title: req.body.title,
        artist: req.body.artist,
        releaseYear: req.body.releaseYear,
        genre: req.body.genre,
        length: req.body.length,
        rating: req.body.rating
    })
        .then(result => {
            Video.findById(result._id)
                .then(video => {
                    return res.json(video)
                })
                .catch(error => {
                    return res.status(404).json({ message: 'error making video' })
                })
        })
})

//-------------------------------------
// PUT /videos/:id - update video by using objectId // douglas
//-------------------------------------
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const updatedVideoData = req.body;

    Video.findByIdAndUpdate(id, updatedVideoData, { new: true })
        .then(updatedVideo => {
            if (!updatedVideo) {
                return res.status(404).json({ error: 'Video not found' });
            }
            res.json(updatedVideo);
        })
        .catch(error => {
            console.error('Error updating video by ID:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
//-------------------------------------
// DELETE /videos/:id - remove video by using ObjectId
//return back all videos
//-------------------------------------
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Video.findByIdAndDelete(id)
        .then(result => {
            console.log(' --- remove video by ObjectId --- \n', result)
            return res.status(200).json({ message: `Video ${id} was deleted successfully` })
        })
        .catch(error => {
            console.error(`Failed to delete video with id=${id}:`, error);
            return res.status(500).json({ error: "Server error" });
        })
})

module.exports = router;