const router = require('express').Router();
const {getAllThoughts, getThoughtById, createThought, updateThought, deleteThought} = require('../../controllers/thought-controller');

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

module.exports = router;