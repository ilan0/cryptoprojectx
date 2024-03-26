const User = require('../models/User');
const Group = require('../models/Group');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(`Attempting to create user with email: ${email}`);

    const user = new User({ username, email, password});

    // Save the new user
    await user.save();
    console.log(`New user created: ${user._id}`);

    // Link any existing group invitations to the new user
    const updateResult = await Group.updateMany(
      { 'invitations.email': email },
      { $set: { 'invitations.$.userId': user._id } }
    );

    // Log the result of the update operation
    console.log(`Invitations updated for new user:`, updateResult);

    // Generate a token for the newly created user
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    console.log(`Token generated for user: ${user._id}`);

    // Respond with the newly created user (minus sensitive information) and their token
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.__v; // Optionally remove the version key
    res.status(201).send({ user: userObject, token });

  } catch (error) {
    console.error("Signup error:", error); // Log error for debugging
    res.status(400).send(error);
  }
};

  
exports.login = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).send({ error: 'Login failed!' });
      }
  
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res.status(400).send({ error: 'Login failed!' });
      }
  
      const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
      res.send({ user, token });
    } catch (error) {
      res.status(400).send(error);
    }
  };