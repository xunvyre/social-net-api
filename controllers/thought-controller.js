const {User, Thought} = require('../models');

const thoughtController =
{
    //GET all thoughts, GET thought by id, POST new thought, PUT update by ID, DELETE by ID
    getAllThoughts(req, res)
    {
        Thought.find({})
        .populate
        ({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    },

    getThoughtById({params}, res)
    {
        Thought.findOne({_id: params.id})
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then(dbThoughtData =>
        {
            if (!dbThoughtData)
            {
                res.status(404).json({message: `This ID has no thoughts.`});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err =>
        {
            console.log(err);
            res.status(400).json(err);
        });
    },

    createThought({body}, res)
    {
        Thought.create(body)
        .then(dbThoughtData =>
        {
            User.findOneAndUpdate
            (
                {_id: body.userId},
                {$push: {thoughts: dbThoughtData._id}},
                {new: true}
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
            .catch(err => res.json(err));
        })
        .catch(err => res.status(400).json(err));
    },

    updateThought({params, body}, res)
    {
        Thought.findOneAndUpdate
        (
            {_id: params.id},
            body,
            {new: true}
        )
        .then(dbThoughtData =>
            {
            if (!dbThoughtData)
            {
                res.status(404).json({message: `No user found under this ID!`});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    },

    deleteThought({params}, res)
    {
        Thought.findOneAndDelete({_id: params.id})
        .then(dbThoughtData =>
        {
            if (!dbThoughtData)
            {
                res.status(404).json({message: `No user found under this ID!`});
                return;
            }
            User.findOneAndUpdate
            (
                {username: dbThoughtData.username},
                {$pull: {thoughts: params.id}}
            )
            .then(() =>
            {
                res.json({message: `Thought removed successfully.`});
            })
            .catch(err => res.status(500).json(err));
        })
        .catch(err => res.status(500).json(err));
    },
};

module.exports = thoughtController;