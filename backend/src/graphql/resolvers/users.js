const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require('apollo-server');

const {validateRegisterInput, validateLoginInput} = require('../../utils/validators');
const User = require("../../models/Users");
const { secretKey } = require("../../config");

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    secretKey,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Mutation: {
    async login(_, {username, password}){
      const {errors, valid} = validateLoginInput(username, password);
      
      if(!valid) {
        throw new UserInputError('Errors', {errors});
      }

      const user = await User.findOne({username});
      if(!user) {
        errors.general = 'User not found'
         throw new UserInputError('User not Found', {errors});
      }

      const match = await bcrypt.compare(password, user.password);
      if(!match) {
        errors.general = 'Wrong Password/Credentials'
        throw new UserInputError('Wrong Password/Credentials', {errors});
      }

      const token = generateToken(user);
      
      return {
        ...user._doc,
        id: user._id,
        token,
      };

    },
    
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } },
      context,
      info
    ) {
      //Validate User Data
      const {valid, errors} = validateRegisterInput(username, email, password, confirmPassword);
      if(!valid) {
        throw new UserInputError('Errors', { errors });
      }
      //Make sure users doesn't already exist
        const user = await User.findOne({  username })
        if (user) {
            throw new UserInputError('Username Taken', {
                error: {username: 'This Username Is Already Taken'}
            }) 
        }
        //hash pwd and created auth token
      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();
      const token = generateToken(res) 

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
