const router = require('express').Router();

//GET all users, GET single user by ID, POST new user, PUT update user, DELETE user, POST add friend, DELETE friend

const {getAllUsers, getUserById, createUser, updateUser, deleteUser, addFriend, deleteFriend} = require('../../controllers/user-controller');

router
.route('/')
.get(getAllUsers)
.post(createUser);

router
.route('/:id')
.get(getUserById)
.put(updateUser)
.delete(deleteUser);

router
.route('/:id/friends/:friendId')
.post(addFriend)
.delete(deleteFriend)

module.exports = router;