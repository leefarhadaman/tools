const express = require('express');
const { unitConversions, simpleConverters } = require('../../constants/conversions');
const router = express.Router();

const simpleConvert = (value, from, to, rates) => value / rates[from] * rates[to];

router.get('/length', (req, res) => {
  const value = parseFloat(req.query.value);
  const from = req.query.from;
  const to = req.query.to;
  const result = value / unitConversions.length[from] * unitConversions.length[to];
  res.json({ result });
});

router.get('/area', (req, res) => {
  const value = parseFloat(req.query.value);
  const from = req.query.from;
  const to = req.query.to;
  const result = value / unitConversions.area[from] * unitConversions.area[to];
  res.json({ result });
});

router.get('/weight', (req, res) => {
  const value = parseFloat(req.query.value);
  const from = req.query.from;
  const to = req.query.to;
  const result = value / unitConversions.weight[from] * unitConversions.weight[to];
  res.json({ result });
});

router.get('/volume', (req, res) => {
  const value = parseFloat(req.query.value);
  const from = req.query.from;
  const to = req.query.to;
  const result = value / unitConversions.volume[from] * unitConversions.volume[to];
  res.json({ result });
});

router.get('/temperature', (req, res) => {
  const value = parseFloat(req.query.value);
  const from = req.query.from;
  const to = req.query.to;
  let result;
  if (from === 'c' && to === 'f') result = unitConversions.temperature.c_to_f(value);
  else if (from === 'f' && to === 'c') result = unitConversions.temperature.f_to_c(value);
  else result = value;
  res.json({ result });
});

Object.keys(simpleConverters).forEach(type => {
  router.get(`/${type}`, (req, res) => {
    const value = parseFloat(req.query.value);
    const from = req.query.from;
    const to = req.query.to;
    const result = simpleConvert(value, from, to, simpleConverters[type]);
    res.json({ result });
  });
});

router.get('/currency', (req, res) => {
  const value = parseFloat(req.query.value);
  const rates = { usd: 1, eur: 0.92, gbp: 0.78, inr: 83.5 }; // Mock rates
  const result = simpleConvert(value, req.query.from, req.query.to, rates);
  res.json({ result });
});

router.get('/number-to-word', (req, res) => {
  const num = parseInt(req.query.number);
  const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  res.json({ word: num >= 0 && num < 10 ? words[num] : num.toString() });
});

router.get('/word-to-number', (req, res) => {
  const words = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9 };
  const num = words[req.query.word.toLowerCase()] ?? parseInt(req.query.word);
  res.json({ number: isNaN(num) ? 'Invalid' : num });
});

router.get('/number-to-roman', (req, res) => {
  const num = parseInt(req.query.number);
  const roman = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
  let result = '';
  for (let key in roman) {
    while (num >= roman[key]) {
      result += key;
      num -= roman[key];
    }
  }
  res.json({ roman: result });
});

router.get('/roman-to-number', (req, res) => {
  const roman = req.query.roman.toUpperCase();
  const values = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 };
  let result = 0;
  for (let i = 0; i < roman.length; i++) {
    if (i + 1 < roman.length && values[roman[i]] < values[roman[i + 1]]) {
      result -= values[roman[i]];
    } else {
      result += values[roman[i]];
    }
  }
  res.json({ number: result });
});

module.exports = router; 
