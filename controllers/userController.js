const { User } = require('../models');

module.exports = {
    createUser(req, res) {
        User.create(req.body)
        .then(user => res.json(user))
        .catch(err => res.status(400).json(err));
    },
    getUser(req, res) {
        User.find({})
        .populate({path: 'thoughts', select: '-__v'})
        .populate({path: 'friends', select:'-__v'})
        .select('-__v')
        .then(user => res.json(user))
        .catch(err => {
            console.log(err);
            res.status(500).json(err)});
        },
    getSingleUser({params}, res) {
        User.findOne({_id: params.id})
        .populate({path: 'thoughts', select: '-__v'})
        .populate({path: 'friends', select: '-__v'})
        .select('-__v')
        .then(user => res.json(user))
        .catch(err => {
            console.log(err);
            res.status(500).json(err)})
        },
    updateUser({params, body}, res) {
        User.findOneAndUpdate({_id: params.id}, body, {runValidators: true, new: true})
        .then(user => {
            if(!user) {
                res.status(404).json({message: 'There is no User with that ID'});
                return;
            }
            res.json(user);
        })
        .catch(err => res.json(err))
        },
    deleteUser({params}, res) {
        User.findOneAndDelete({ _id: params.id})
        .then(user => {
            if(!user) {
                res.status(404).json({message: 'There is no User with that ID'});
                return;
            }
            res.json(user);
        })
        .catch(err => res.status(400).json(err));
        },
    addFriend(req, res) {
        User.findOneAndUpdate({ _id: req.params.id }, {$push: {friends: req.params.friendId}}, {new: true})
        .populate({path: 'friends', select: ('-__v')})
        .select('-__v')
        .then(user => {
            if(!user) {
                res.status(404).json({ message: 'There is no User with that ID'});
                return;
            }
            res.json(user);
        })
        .catch(err => res.json(err));
        },
    removeFriend(req, res) {
        User.findOneAndUpdate({ _id: req.params.id }, {$pull: {friends: req.params.friendId}}, {new: true})
        .populate({path: 'friends', select: '-__v'})
        .select('-__v')
        .then(user => {
            if (!user) {
                res.status(404).json({message: 'There is no User with that ID'});
                return;
            }
            res.json(user);
        })
        .catch(err => res.status(400).json(err))
    }
    }

