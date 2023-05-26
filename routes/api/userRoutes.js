const router = require('express').Router();

const {createUser, getUser, getSingleUser, updateUser, deleteUser, addFriend, removeFriend} =
require('../../controllers/userController');

router.route('/').get(getUser).post(createUser);

router.route('/:id').get(getSingleUser).put(updateUser).delete(deleteUser);

router.route('/:id/friends/:friendId').post(addFriend).delete(removeFriend);

module.exports = router;