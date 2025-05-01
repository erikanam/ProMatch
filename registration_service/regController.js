const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const regModel = require('./regModel'); // Import the model for DB operations

const regController = {
  // Handle user registration
  registerUser: async (req, res) => {
    const { email, password } = req.body;  // Removed full_name since it's not needed

    // Check if all fields are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Password validation regex (no need to assign it to a variable)
    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long and include a number and special character.' });
    }

    try {
      // Check if the user already exists
      if (await regModel.checkIfUserExists(email)) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create the new user
      const newUser = await regModel.createUser(email, hashedPassword);

      // Generate JWT token for the new user
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES || '1h' }
      );

      // Send a successful response with user info and JWT token
      res.status(201).json({
        id: newUser.id,
        email: newUser.email,
        token
      });
    } catch (err) {
      console.error('Error during registration:', err);
      res.status(500).json({ error: 'Server error during registration' });
    }
  },
};

module.exports = regController;
