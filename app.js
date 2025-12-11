const express = require('express');
const app = express();

// VULNERABILITY 1: SQL Injection
app.get('/user', (req, res) => {
  const userId = req.query.id;
  // Bad: Direct string concatenation
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  // This would execute: db.query(query)
  res.send('User query executed');
});

// VULNERABILITY 2: Command Injection
app.get('/ping', (req, res) => {
  const host = req.query.host;
  // Bad: Unsanitized user input in shell command
  const { exec } = require('child_process');
  exec(`ping -c 4 ${host}`, (error, stdout) => {
    res.send(stdout);
  });
});

// VULNERABILITY 3: Hardcoded Credentials
const DB_PASSWORD = 'admin123';  // Bad: Hardcoded password
const API_KEY = 'sk-1234567890abcdef';  // Bad: Exposed API key

// VULNERABILITY 4: Path Traversal
app.get('/file', (req, res) => {
  const fileName = req.query.name;
  // Bad: No path sanitization
  const filePath = `./uploads/${fileName}`;
  res.sendFile(filePath);
});

// VULNERABILITY 5: Weak Cryptography
const crypto = require('crypto');
function hashPassword(password) {
  // Bad: MD5 is cryptographically broken
  return crypto.createHash('md5').update(password).digest('hex');
}

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
