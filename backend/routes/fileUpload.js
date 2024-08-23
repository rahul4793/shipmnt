const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const ExcelData = require('../Models/ExcelData');

const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), async (req, res) => {
  console.log("running");
  try {
    if (!req.file) {
      console.log("empty");
      return res.status(400).json({ message: 'No file uploaded' });
    }

  
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const headers = data[0];
    const rows = data.slice(1);

    const document = {
      rows: rows.map(row => {
        const rowData = {};
        
        headers.forEach((header, index) => {
          rowData[header] = row[index];
        });

        return rowData;
      })
    };

    if (document.rows.length === 0) {
      return res.status(400).json({ message: 'No valid data found' });
    }

    console.log(document);


    await ExcelData.create(document);

    res.status(200).json({ message: 'File data saved successfully!' });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ message: 'Error processing file' });
  }
});

module.exports = router;
