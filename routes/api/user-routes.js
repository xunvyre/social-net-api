const router = require('express').Router();

//GET all users, GET single user by ID, POST new user, PUT update user, DELETE user

const {getAllUsers, getUserById, createUser, updateUser, deleteUser} = require('../../controllers/user-controller');

router
.route('/')
.get(getAllUsers)
.post(createUser);

router
.route('/:id')
.get(getUserById)
.put(updateUser)
.delete(deleteUser);

module.exports = router;