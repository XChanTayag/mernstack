const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../../middleware/auth');

const validateChecks = require('../../common/validation');
const serverError = require('../../common/error');

const Profile = require('../../model/Profile');
const User = require('../../model/User');
const Post = require('../../model/Post');

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    validateChecks(res, req);

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      serverError(res, err);
    }
  }
);

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });

    res.json(posts);
  } catch (err) {
    serverError(res, err);
  }
});

// @route   GET api/posts/:post_id
// @desc    Get post by id
// @access  Private
router.get('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    serverError(res, err);
  }
});

// @route   DELETE api/posts/:post_id
// @desc    Delete a post
// @access  Private
router.delete('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();

    res.json({ msg: 'Post Removed' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    serverError(res, err);
  }
});

// @route   PUT api/posts/like/:post_id
// @desc    Like a Post
// @access  Private
router.put('/like/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    // Check if the post has already been liked by the user
    if (post.likes.filter((like) => like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ msg: 'Post already like' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();
    res.json(post.likes);
  } catch (err) {
    serverError(res, err);
  }
});

// @route   PUT api/posts/unlike/:post_id
// @desc    UnLike a Post
// @access  Private
router.put('/unlike/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    // Check if the post has already been liked by the user
    if (post.likes.filter((like) => like.user.toString() === req.user.id).length === 0) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    // Get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();
    res.json(post.likes);
  } catch (err) {
    serverError(res, err);
  }
});

// @route   POST api/posts/comment/:post_id
// @desc    Create a comment on a Post
// @access  Private
router.post(
  '/comment/:post_id',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    validateChecks(res, req);

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.post_id);

      console.log(post);
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      serverError(res, err);
    }
  }
);

// @route   DELETE api/posts/comment/:post_id/:comment_id
// @desc    Delete comment
// @access  Private
router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    // Pull out comment
    const comment = post.comments.find((comment) => comment.id === req.params.comment_id);

    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not Authorized' });
    }

    // Get remove index
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();
    res.json(post.comments);
  } catch (err) {
    serverError(res, err);
  }
});

module.exports = router;
