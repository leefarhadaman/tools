const express = require('express');
const router = express.Router();

router.get('/lorem-ipsum', (req, res) => {
  const words = req.query.words ? parseInt(req.query.words) : 50;
  const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '.split(' ');
  let result = '';
  for (let i = 0; i < words; i++) {
    result += lorem[Math.floor(Math.random() * lorem.length)] + ' ';
  }
  res.json({ loremIpsum: result.trim() });
});

router.get('/random-word', (req, res) => {
  const count = req.query.count ? parseInt(req.query.count) : 1;
  const words = ['apple', 'blue', 'code', 'data', 'echo', 'fast', 'grow', 'jump', 'kind', 'love'];
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(words[Math.floor(Math.random() * words.length)]);
  }
  res.json({ words: result });
});

router.post('/word-counter', (req, res) => {
  const text = req.body.text || '';
  const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  res.json({ wordCount: words });
});

module.exports = router; 
