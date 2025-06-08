const express = require('express');
const sharp = require('sharp');
const router = express.Router();

router.post('/ico-to-png', async (req, res) => {
  try {
    const buffer = Buffer.from(req.body.ico, 'base64');
    const png = await sharp(buffer).png().toBuffer();
    res.json({ png: png.toString('base64') });
  } catch (err) {
    res.status(500).json({ error: 'Failed to convert ICO to PNG' });
  }
});

router.post('/ico-converter', async (req, res) => {
  try {
    const buffer = Buffer.from(req.body.image, 'base64');
    const ico = await sharp(buffer).resize(256, 256).toFormat('ico').toBuffer();
    res.json({ ico: ico.toString('base64') });
  } catch (err) {
    res.status(500).json({ error: 'Failed to convert to ICO' });
  }
});

router.post('/image-to-base64', async (req, res) => {
  try {
    const buffer = Buffer.from(req.body.image, 'base64');
    res.json({ base64: buffer.toString('base64') });
  } catch (err) {
    res.status(500).json({ error: 'Failed to convert image to base64' });
  }
});

router.post('/jpg-to-png', async (req, res) => {
  try {
    const buffer = Buffer.from(req.body.jpg, 'base64');
    const png = await sharp(buffer).png().toBuffer();
    res.json({ png: png.toString('base64') });
  } catch (err) {
    res.status(500).json({ error: 'Failed to convert JPG to PNG' });
  }
});

router.post('/png-to-jpg', async (req, res) => {
  try {
    const buffer = Buffer.from(req.body.png, 'base64');
    const jpg = await sharp(buffer).jpeg().toBuffer();
    res.json({ jpg: jpg.toString('base64') });
  } catch (err) {
    res.status(500).json({ error: 'Failed to convert PNG to JPG' });
  }
});

router.post('/jpg-converter', async (req, res) => {
  try {
    const buffer = Buffer.from(req.body.image, 'base64');
    const jpg = await sharp(buffer).jpeg().toBuffer();
    res.json({ jpg: jpg.toString('base64') });
  } catch (err) {
    res.status(500).json({ error: 'Failed to convert to JPG' });
  }
});

router.post('/webp-to-jpg', async (req, res) => {
  try {
    const buffer = Buffer.from(req.body.webp, 'base64');
    const jpg = await sharp(buffer).jpeg().toBuffer();
    res.json({ jpg: jpg.toString('base64') });
  } catch (err) {
    res.status(500).json({ error: 'Failed to convert WEBP to JPG' });
  }
});

module.exports = router; 
