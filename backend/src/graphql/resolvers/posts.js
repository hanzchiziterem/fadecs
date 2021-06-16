const { AuthenticationError } = require("apollo-server");

const Post = require("../../models/Post");
const checkAuth = require("../../utils/checkAuth.js");

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },

    //Gets Posts from database
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        //checks if post exists
        if (post) {
          return post;
        } else {
          throw new Error("Post Not Found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    async createPost(_, { body }, context) {
      const user = checkAuth(context);
      // console.log(user);
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });
      const post = await newPost.save();
      return post;
    },

    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);
      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return "Post deleted Successfully";
        } else {
          throw new AuthenticationError(
            "Cant delete someones post. Action not allowed"
          );
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
