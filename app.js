const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fileController = require('./controllers/fileController');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/csvdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/upload', fileController.uploadFile);
app.get('/download', fileController.downloadFile);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
