// regModel.js
const db = require('./db'); 

const regModel = {

  checkIfUserExists: async (email) => {
    try {
      const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows.length > 0; 
    } catch (err) {
      console.error('Error checking if user exists:', err);
      throw new Error('Database error while checking user existence');
    }
  },


  createUser: async (email, hashedPassword) => {
    try {
      const result = await db.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
        [email, hashedPassworsd]
      );
      return result.rows[0]; 
    } catch (err) {
      console.error('Error creating user in DB:', err);
      throw new Error('Database error while creating user');
    }
  },
};

module.exports = regModel;
