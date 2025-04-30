const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// Dummy Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'admin') {
    const token = jwt.sign(
      { role: 'Admin', exp: Math.floor(Date.now() / 1000) + (60 * 60) },
      process.env.JWT_SECRET || 'mysecret123'
    );

    return res.json({ token });
  }

  res.status(401).json({ error: 'Invalid credentials' });
});

// Test Route
app.get('/', (req, res) => {
  res.json({ message: 'Contrify API is running ✅' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:\${PORT}`);
});
