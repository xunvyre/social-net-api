const router = require('express').Router();
const {getAllThoughts, getThoughtById, createThought, updateThought, deleteThought, addReaction, deleteReaction} = require('../../controllers/thought-controller');

//GET all thoughts, GET single thought by ID, POST new thought, PUT update thought, DELETE thought

router
.route('/')
.get(getAllThoughts)
.post(createThought);

router
.route('/:id')
.get(getThoughtById)
.put(updateThought)
.delete(deleteThought);

//POST add reaction, DELETE reaction

router
.route('/:thoughtId/reactions/')
.post(addReaction)

router
.route('/:thoughtId/reactions/:reactionId')
.delete(deleteReaction)

module.exports = router;