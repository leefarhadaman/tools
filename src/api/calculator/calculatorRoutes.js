const express = require('express');
const router = express.Router();

router.get('/age', (req, res) => {
  const birthDate = new Date(req.query.birthDate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  res.json({ age });
});

router.get('/percentage', (req, res) => {
  const value = parseFloat(req.query.value);
  const total = parseFloat(req.query.total);
  const percentage = (value / total) * 100;
  res.json({ percentage });
});

router.get('/average', (req, res) => {
  const numbers = req.query.numbers.split(',').map(Number);
  const average = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  res.json({ average });
});

router.get('/confidence-interval', (req, res) => {
  const mean = parseFloat(req.query.mean);
  const stdDev = parseFloat(req.query.stdDev);
  const n = parseFloat(req.query.n);
  const z = 1.96; // 95% confidence
  const margin = z * (stdDev / Math.sqrt(n));
  res.json({ interval: [mean - margin, mean + margin] });
});

router.get('/sales-tax', (req, res) => {
  const amount = parseFloat(req.query.amount);
  const rate = parseFloat(req.query.rate);
  const tax = amount * (rate / 100);
  res.json({ tax, total: amount + tax });
});

router.get('/margin', (req, res) => {
  const revenue = parseFloat(req.query.revenue);
  const cost = parseFloat(req.query.cost);
  const margin = ((revenue - cost) / revenue) * 100;
  res.json({ margin });
});

router.get('/probability', (req, res) => {
  const favorable = parseFloat(req.query.favorable);
  const total = parseFloat(req.query.total);
  const probability = favorable / total;
  res.json({ probability });
});

router.get('/paypal-fee', (req, res) => {
  const amount = parseFloat(req.query.amount);
  const fee = amount * 0.029 + 0.3;
  res.json({ fee, total: amount + fee });
});

router.get('/discount', (req, res) => {
  const price = parseFloat(req.query.price);
  const discount = parseFloat(req.query.discount);
  const savings = price * (discount / 100);
  res.json({ savings, discountedPrice: price - savings });
});

router.get('/cpm', (req, res) => {
  const cost = parseFloat(req.query.cost);
  const impressions = parseFloat(req.query.impressions);
  const cpm = (cost / impressions) * 1000;
  res.json({ cpm });
});

router.get('/loan', (req, res) => {
  const principal = parseFloat(req.query.principal);
  const rate = parseFloat(req.query.rate) / 100 / 12;
  const months = parseFloat(req.query.months);
  const payment = (principal * rate) / (1 - Math.pow(1 + rate, -months));
  res.json({ monthlyPayment: payment, total: payment * months });
});

router.get('/gst', (req, res) => {
  const amount = parseFloat(req.query.amount);
  const rate = parseFloat(req.query.rate);
  const gst = amount * (rate / 100);
  res.json({ gst, total: amount + gst });
});

module.exports = router; 
