const express = require('express');
const router = express.Router();
// import the Game Model
const { Game } = require('../models')

// Creating routes that allow us to
// 1. return an array of objects [{}, {}, {}]
// 2. return a game based on ObjectId
// 3. return a game based on a search input
// 4. create a game and return an object of the new game
// 5. update a game by the objectId
// 6. remove a game and return back to all games

//-------------------------------------
// GET /games - return all games
//-------------------------------------
router.get('/', (req, res) => {
    Game.find({})
        .then(games => {
            console.log('--- all games---\n', games)
            return res.json(games)
        })
        .catch(error => {
            console.log('---error---\n', error)
            return res.status(500).json({ error: 'internal server error' })
        })
})


//-------------------------------------
// GET /games/search - return one game by search query //daniel
//-------------------------------------
router.get('/search', (req, res) => {
    // Construct a query object based on req.query
    let queryObject = {};
    if (req.query.title) {
        queryObject.title = req.query.title;
    }
    if (req.query.publisher) {
        queryObject.publisher = req.query.publisher;
    }
    if (req.query.releaseYear) {
        queryObject.releaseYear = req.query.releaseYear;
    }
    if (req.query.price) {
        queryObject.price = req.query.price;
    }
    if (req.query.genre) {
        queryObject.genre = req.query.genre;
    }
    if (req.query.rating) {
        queryObject.rating = req.query.rating;
    }

    // Use the query object in the MongoDB query with findOne
    Game.findOne(queryObject)
        .then(game => {
            if (!game) {
                return res.status(404).send('No game found matching the criteria.');
            }

            res.json(game);
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        });
});
//-------------------------------------
// GET /games/:id - return one game by ObjectId
//-------------------------------------
router.get('/:id', (req, res) => {
    Game.findById(req.params.id)
        .then(game => {
            console.log('--- games search by ObjectId--- \n', game)
            return res.json(game)
        })
        .catch(error => {
            console.log('---- read by id error ---\n', error)
            return res.status(404).json({ message: "No game with this ID" })
        })
})

//-------------------------------------
// POST /games/new - create new game and return new game // abby
//-------------------------------------
router.post('/new', (req, res) => {
    Game.create({
        title: req.body.title,
        publisher: req.body.publisher,
        releaseYear: req.body.releaseYear,
        price: req.body.price,
        genre: req.body.genre,
        rating: req.body.rating
    })
        .then(result => {
            Game.findById(result._id)
                .then(game => {
                    return res.json(game)
                })
                .catch(error => {
                    return res.status(404).json({ message: 'error making game' })
                })
        })
})

//-------------------------------------
// PUT /games/:id - update game by using objectId // douglas
//-------------------------------------
router.put('/:id', (req, res) => {
    const gameId = req.params.id;
    const updatedGameData = req.body;

    Game.findByIdAndUpdate(gameId, updatedGameData, { new: true })
        .then(updatedGame => {
            if (!updatedGame) {
                return res.status(404).json({ error: 'Game not found' });
            }
            res.json(updatedGame);
        })
        .catch(error => {
            console.error('Error updating game by ID:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
//-------------------------------------
// DELETE /games/:id - remove game by using ObjectId
//return back all games
//-------------------------------------
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Game.findByIdAndDelete(id)
        .then(result => {
            console.log(' --- remove game by ObjectId --- \n', result)
            return res.status(200).json({ message: `Game ${id} was deleted successfully` })
        })
        .catch(error => {
            console.error(`Failed to delete game with id=${id}:`, error);
            return res.status(500).json({ error: "Server error" });
        })
})

module.exports = router;