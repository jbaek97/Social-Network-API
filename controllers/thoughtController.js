const { Thought, User } = require('../models');

module.exports = {
    getThought: (req, res) => {
        Thought.find({})
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then((thoughts) => res.json(thoughts))
        .catch((err) => res.status(500).json(err)); 
    },
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then((thought) => !thought ? res.status(404).json({ message: 'There is no thought assigned to that ID'}) : res.json(thought))
        .catch((err) => res.status(500).json(err));
    },
    createThought: async(req, res) => {
        const thought = await Thought.create(req.body)
        .then((thought) => {
            return User.findOneAndUpdate(
                { username: thought.username },
                { $push: {thoughts: thought._id}},
                { new: true},
                { runValidators: true, new: true}
            ) .populate({
                path: 'thoughts',
                select: '-__v'
            });
        })
        return res.json(thought); 
    },
    updateThought({params, body}, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId }, { $set: body}, { runValidators: true, new: true})
        .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought found with this ID!" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
    },
    deleteThought({params}, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId },)
        .then(thought => {
            if(!thought) {
                res.status(400).json({ message: "There is no thought with this ID"});
                return;
            }
            res.json(thought);
        })
        .catch(err => res.status(400).json(err))
    },
    addReaction({params}, res) {
        Thought.findOneAndUpdate({_id: params.thoughtId}, {$push: {reactions: { _id: params.thoughtId}}}, {new: true})
        .populate({path: "reactions",
                select: '-__v'})
        .select("-__v")
        .then(thought => {
            if(!thought) {
                res.status(400).json({ message: "There is no thought with this ID"});
                return;
            }
            res.json(thought);
        })
        .catch(err => res.status(400).json(err))
    },
    deleteReaction({params}, res) {
        Thought.findOneAndUpdate({_id: params.thoughtId}, {$pull: {reactions: { _id: params.thoughtId }}}, {new: true})
        .then(thought => {
            if (!thought) {
                res.status(400).json({message: "There is no thought with this ID"});
                return;
            }
            res.json(thought);
        })
        .catch(err => res.status(400).json(err));
    }
}

