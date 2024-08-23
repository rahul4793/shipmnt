


const mongoose = require('mongoose');

const excelDataSchema = new mongoose.Schema({
  rows: [
    {
      type: Map,
      of: String 
    }
  ]
});

const ExcelData = mongoose.model('ExcelData', excelDataSchema);

module.exports = ExcelData;
