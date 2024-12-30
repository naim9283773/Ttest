require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const People = require('./models/People');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Middleware to store user info
app.use(async (req, res, next) => {
  if (req.query.id) {
    const user = await People.findOne({ telegramId: req.query.id });
    res.locals.user = user;
  }
  next();
});

// Route: Telegram Auth Callback
app.get('/auth/telegram', async (req, res) => {
  const { id, first_name, last_name, username, photo_url } = req.query;

  if (!id) {
    return res.status(400).send('Authentication failed.');
  }

  // Save or find user in MongoDB
  let user = await People.findOne({ telegramId: id });
  if (!user) {
    user = new People({
      telegramId: id,
      firstName: first_name,
      lastName: last_name,
      username,
      photoUrl: photo_url,
      balance: Math.floor(Math.random() * 10000), // Random initial balance
    });
    await user.save();
  }

  res.redirect(`/?id=${id}`);
});

// Route: Home
app.get('/', async (req, res) => {
  const user = res.locals.user;
  if (!user) return res.redirect('/auth/telegram');
  res.render('home', { user });
});

// Route: Balance
app.get('/balance', async (req, res) => {
  const user = res.locals.user;
  if (!user) return res.redirect('/auth/telegram');
  res.render('balance', { user });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));