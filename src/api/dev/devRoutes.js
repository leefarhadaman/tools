const express = require('express');
const router = express.Router();

router.post('/json-viewer', (req, res) => {
  try {
    const json = JSON.parse(req.body.json);
    res.json({ viewed: json });
  } catch (err) {
    res.status(400).json({ error: 'Invalid JSON' });
  }
});

router.post('/json-formatter', (req, res) => {
  try {
    const formatted = JSON.stringify(JSON.parse(req.body.json), null, 2);
    res.json({ formatted });
  } catch (err) {
    res.status(400).json({ error: 'Invalid JSON' });
  }
});

router.post('/json-validator', (req, res) => {
  try {
    JSON.parse(req.body.json);
    res.json({ valid: true });
  } catch (err) {
    res.json({ valid: false, error: err.message });
  }
});

router.post('/json-editor', (req, res) => {
  try {
    const json = JSON.parse(req.body.json);
    res.json({ edited: json });
  } catch (err) {
    res.status(400).json({ error: 'Invalid JSON' });
  }
});

router.post('/json-minify', (req, res) => {
  try {
    const minified = JSON.stringify(JSON.parse(req.body.json));
    res.json({ minified });
  } catch (err) {
    res.status(400).json({ error: 'Invalid JSON' });
  }
});

router.post('/xml-to-json', (req, res) => {
  try {
    const xml = req.body.xml;
    const json = { note: 'Simple XML to JSON conversion not fully implemented' };
    res.json({ json });
  } catch (err) {
    res.status(400).json({ error: 'Invalid XML' });
  }
});

router.post('/csv-to-json', (req, res) => {
  try {
    const csv = req.body.csv.split('\n').map(row => row.split(','));
    const headers = csv[0];
    const json = csv.slice(1).map(row => {
      let obj = {};
      headers.forEach((h, i) => obj[h] = row[i]);
      return obj;
    });
    res.json({ json });
  } catch (err) {
    res.status(400).json({ error: 'Invalid CSV' });
  }
});

router.post('/tsv-to-json', (req, res) => {
  try {
    const tsv = req.body.tsv.split('\n').map(row => row.split('\t'));
    const headers = tsv[0];
    const json = tsv.slice(1).map(row => {
      let obj = {};
      headers.forEach((h, i) => obj[h] = row[i]);
      return obj;
    });
    res.json({ json });
  } catch (err) {
    res.status(400).json({ error: 'Invalid TSV' });
  }
});

router.post('/json-to-xml', (req, res) => {
  try {
    const json = JSON.parse(req.body.json);
    res.json({ xml: '<note>Simple JSON to XML conversion not fully implemented</note>' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid JSON' });
  }
});

router.post('/json-to-csv', (req, res) => {
  try {
    const json = JSON.parse(req.body.json);
    const headers = Object.keys(json[0]);
    const csv = [headers.join(',')];
    json.forEach(obj => {
      csv.push(headers.map(h => obj[h]).join(','));
    });
    res.json({ csv: csv.join('\n') });
  } catch (err) {
    res.status(400).json({ error: 'Invalid JSON' });
  }
});

router.post('/json-to-text', (req, res) => {
  try {
    const text = JSON.stringify(JSON.parse(req.body.json));
    res.json({ text });
  } catch (err) {
    res.status(400).json({ error: 'Invalid JSON' });
  }
});

router.post('/json-to-tsv', (req, res) => {
  try {
    const json = JSON.parse(req.body.json);
    const headers = Object.keys(json[0]);
    const tsv = [headers.join('\t')];
    json.forEach(obj => {
      tsv.push(headers.map(h => obj[h]).join('\t'));
    });
    res.json({ tsv: tsv.join('\n') });
  } catch (err) {
    res.status(400).json({ error: 'Invalid JSON' });
  }
});

module.exports = router; 
