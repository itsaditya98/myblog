const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');

// Configure MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'blog_app'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to the database');
});

// Configure middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(__dirname));

// Define routes

// Route to save a blog post
app.post('/save-blog', (req, res) => {
    const { title, content } = req.body;
    const query = 'INSERT INTO blogs (title, content) VALUES (?, ?)';
    db.query(query, [title, content], (err, result) => {
      if (err) {
        console.error('Failed to save blog post:', err);
        res.status(500).send('Failed to save blog post');
        return;
      }
      console.log('Blog post saved:', result);
      res.status(200).send('Blog post saved');
    });
  });

// Route to get all blog posts
app.get('/blogs', (req, res) => {
  const sql = 'SELECT * FROM blogs ORDER BY created_at DESC';
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to retrieve blog posts' });
    } else {
      res.status(200).json(result);
    }
  });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html');
  });

// Start the server
app.listen(1000, () => {
  console.log('Server is running on port 1000');
});
