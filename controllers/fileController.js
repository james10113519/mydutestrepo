const mongoose = require('mongoose');
const File = require('../models/fileModel');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const { createObjectCsvStringifier } = require('csv-writer');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Upload CSV file
exports.uploadFile = [upload.single('csvFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        await File.create({ data: results });
        fs.unlinkSync(req.file.path); // Clean up the uploaded file
        res.redirect('/');
      } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('Error uploading file.');
      }
    });
}];

// Download CSV data
exports.downloadFile = async (req, res) => {
  const { startTime, endTime } = req.query;
  try {
    const query = {};
    if (startTime && endTime) {
      query.uploadedAt = { $gte: new Date(startTime), $lte: new Date(endTime) };
    }

    const files = await File.find(query);
    if (!files.length) {
      return res.status(404).send('No data found for the specified time range.');
    }

    const data = files.flatMap(file => file.data);
    if (data.length === 0) {
      return res.status(404).send('No data available to download.');
    }

    const csvWriter = createObjectCsvStringifier({
      header: Object.keys(data[0]).map(key => ({ id: key, title: key })),
    });

    const csvContent = csvWriter.getHeaderString() + csvWriter.stringifyRecords(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('data.csv');
    res.send(csvContent);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).send(`Error downloading file: ${error.message}`);
  }
};
