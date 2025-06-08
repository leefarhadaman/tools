const express = require('express');
const router = express.Router();

router.get('/text-to-binary', (req, res) => {
  const text = req.query.text;
  const binary = text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
  res.json({ binary });
});

router.get('/binary-to-text', (req, res) => {
  const binary = req.query.binary.split(' ');
  const text = binary.map(b => String.fromCharCode(parseInt(b, 2))).join('');
  res.json({ text });
});

router.get('/hex-to-binary', (req, res) => {
  const hex = req.query.hex;
  const binary = hex.match(/.{1,2}/g).map(h => parseInt(h, 16).toString(2).padStart(8, '0')).join(' ');
  res.json({ binary });
});

router.get('/binary-to-hex', (req, res) => {
  const binary = req.query.binary.split(' ');
  const hex = binary.map(b => parseInt(b, 2).toString(16).padStart(2, '0')).join('');
  res.json({ hex });
});

router.get('/ascii-to-binary', (req, res) => {
  const ascii = req.query.ascii;
  const binary = ascii.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
  res.json({ binary });
});

router.get('/binary-to-ascii', (req, res) => {
  const binary = req.query.binary.split(' ');
  const ascii = binary.map(b => String.fromCharCode(parseInt(b, 2))).join('');
  res.json({ ascii });
});

router.get('/decimal-to-binary', (req, res) => {
  const decimal = parseInt(req.query.decimal);
  res.json({ binary: decimal.toString(2) });
});

router.get('/binary-to-decimal', (req, res) => {
  const binary = req.query.binary;
  res.json({ decimal: parseInt(binary, 2) });
});

router.get('/text-to-ascii', (req, res) => {
  const text = req.query.text;
  const ascii = text.split('').map(c => c.charCodeAt(0)).join(' ');
  res.json({ ascii });
});

router.get('/ascii-to-text', (req, res) => {
  const ascii = req.query.ascii.split(' ').map(Number);
  const text = ascii.map(n => String.fromCharCode(n)).join('');
  res.json({ text });
});

router.get('/hex-to-decimal', (req, res) => {
  const hex = req.query.hex;
  res.json({ decimal: parseInt(hex, 16) });
});

router.get('/decimal-to-hex', (req, res) => {
  const decimal = parseInt(req.query.decimal);
  res.json({ hex: decimal.toString(16) });
});

router.get('/octal-to-binary', (req, res) => {
  const octal = req.query.octal;
  const binary = parseInt(octal, 8).toString(2);
  res.json({ binary });
});

router.get('/binary-to-octal', (req, res) => {
  const binary = req.query.binary;
  const octal = parseInt(binary, 2).toString(8);
  res.json({ octal });
});

router.get('/octal-to-decimal', (req, res) => {
  const octal = req.query.octal;
  res.json({ decimal: parseInt(octal, 8) });
});

router.get('/decimal-to-octal', (req, res) => {
  const decimal = parseInt(req.query.decimal);
  res.json({ octal: decimal.toString(8) });
});

router.get('/hex-to-octal', (req, res) => {
  const hex = req.query.hex;
  const octal = parseInt(hex, 16).toString(8);
  res.json({ octal });
});

router.get('/octal-to-hex', (req, res) => {
  const octal = req.query.octal;
  const hex = parseInt(octal, 8).toString(16);
  res.json({ hex });
});

router.get('/text-to-octal', (req, res) => {
  const text = req.query.text;
  const octal = text.split('').map(c => c.charCodeAt(0).toString(8)).join(' ');
  res.json({ octal });
});

router.get('/octal-to-text', (req, res) => {
  const octal = req.query.octal.split(' ');
  const text = octal.map(o => String.fromCharCode(parseInt(o, 8))).join('');
  res.json({ text });
});

router.get('/text-to-hex', (req, res) => {
  const text = req.query.text;
  const hex = text.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
  res.json({ hex });
});

router.get('/hex-to-text', (req, res) => {
  const hex = req.query.hex.split(' ');
  const text = hex.map(h => String.fromCharCode(parseInt(h, 16))).join('');
  res.json({ text });
});

router.get('/text-to-decimal', (req, res) => {
  const text = req.query.text;
  const decimal = text.split('').map(c => c.charCodeAt(0)).join(' ');
  res.json({ decimal });
});

router.get('/decimal-to-text', (req, res) => {
  const decimal = req.query.decimal.split(' ').map(Number);
  const text = decimal.map(d => String.fromCharCode(d)).join('');
  res.json({ text });
});

module.exports = router; 
