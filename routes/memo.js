const express = require('express');

const router = express.Router();

// Routes
router.get('/', (req, res) => {
  res.send('Nous sommes dans memo');
});

module.exports = router;
