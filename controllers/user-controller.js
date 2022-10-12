const {User, Thought} = require('../models');

const userController =
{
  //GET all users, GET single user by ID, POST new user, PUT update user, DELETE user

    getAllUsers(req, res)
    {
        User.find({})
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err =>
        {
            console.log(err);
            res.status(500).json(err);
        })
    },

    getUserById({params}, res)
    {
        User.findOne({ _id: params.id})
        .populate
        ([
            {path: 'thoughts', select: '-__v'},
            {path: 'friends', select: '-__v'}
        ])
        .select('-__v')
        .then(dbUserData =>
        {
            if (!dbUserData)
            {
                res.status(404).json({message: `No user found under this ID!`});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err =>
        {
            console.log(err);
            res.status(400).json(err);
        });
    },

    createUser({body}, res)
    {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(400).json(err));
    },

    updateUser({params, body}, res)
    {
        User.findOneAndUpdate
        (
            {_id: params.id},
            body,
            {new: true, runValidators: true}
        )
        .then(dbUserData =>
        {
            if (!dbUserData)
            {
                res.status(404).json({message: `No user found under this ID!`});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    deleteUser({params}, res)
    {
        User.findOneAndDelete({_id: params.id})
        .then(dbUserData =>
        {
            if (!dbUserData)
            {
                res.status(404).json({message: `No user found under this ID!`});
                return;
            }
            User.updateMany
            (
                {_id : {$in: dbUserData.friends}},
                {$pull: {friends: params.id}}
            )
            .then(() =>
            {
                Thought.deleteMany({username: dbUserData.username})
                .then(() =>
                {
                    res.json({message: `User deleted successfully.`});
                })
                .catch(err => res.status(400).json(err));
            })
            .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));
    },

    //POST new friend, DELETE friend

    addFriend({params}, res)
    {
        User.findOneAndUpdate
        (
            {_id: params.id},
            {$push: {friends: params.friendId}},
            {new: true, runValidators: true}
        )
        .populate
        ({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then(dbUserData =>
        {
            if (!dbUserData)
            {
                res.status(404).json({message: `No user found under this ID!`});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    deleteFriend({params}, res)
    {
        User.findOneAndUpdate
        (
            {_id: params.id},
            {$pull: {friends: params.friendId}},
            {new: true}
        )
        .populate
        ({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then(dbUserData =>
        {
            if(!dbUserData)
            {
                res.status(404).json({message: `No user found under this ID!`});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    }
};

module.exports = userController;