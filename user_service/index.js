require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'User Service running' });
});

app.get('/api/user', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id; 
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    delete user.password; 
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/register', async (req, res) => {
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const doesUserExist = await checkIfUserExists(email);
    if (doesUserExist) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const newUser = await createUser(full_name, email, password);

    const token = jwt.sign(
      { id: newUser.id, full_name: newUser.full_name, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '1h' }
    );

    res.status(201).json({ ...newUser, token });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

async function getUserById(id) {
  try {
    const result = await pool.query(
      'SELECT id, full_name, email FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  } catch (err) {
    console.error('Error fetching user from DB:', err);
    throw err;
  }
}

async function checkIfUserExists(email) {
  try {
    const result = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    return result.rows.length > 0;
  } catch (err) {
    console.error('Database error while checking user existence:', err);
    throw new Error('Database error');
  }
}

async function createUser(full_name, email, password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 12);  
    const result = await pool.query(
      'INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING id, full_name, email',
      [full_name, email, hashedPassword]
    );
    return result.rows[0];
  } catch (err) {
    console.error('Error creating user in DB:', err);
    throw new Error('Database error');
  }
}

function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ error: 'Access denied. No token provided or invalid format.' });
  }

  const token = authHeader.split(' ')[1]; 

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = user; 
    next();
  });
}

app.listen(PORT, () => {
  console.log(`User Service listening on http://localhost:${PORT}`);
});
