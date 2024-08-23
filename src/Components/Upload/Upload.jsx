import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Table, Button, message } from 'antd';
import axios from 'axios';

function Upload() {
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [file, setFile] = useState(null);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length) {
          const headers = jsonData[0];
          const rows = jsonData.slice(1);

          const tableColumns = headers.map((header) => ({
            title: header,
            dataIndex: header,
            key: header,
          }));

          const tableData = rows.map((row, index) => {
            const rowData = {};
            headers.forEach((header, colIndex) => {
              rowData[header] = row[colIndex];
            });
            return { key: index, ...rowData };
          });

          setColumns(tableColumns);
          setTableData(tableData);
        }
      };
      reader.readAsArrayBuffer(uploadedFile);
    }
  };

  const handleSaveFile = async () => {
    if (!file) {
      message.error('No file selected!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://localhost:3001/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        message.success('File data saved successfully!');
      } else {
        message.error('Failed to save file data.');
      }
    } catch (error) {
      message.error('Error saving file data: ' + error.message);
    }
  };

  return (
    <>
      <h1>Upload Excel File</h1>
      <input type="file" accept=".xls,.xlsx" onChange={handleFileUpload} />
      <Button 
        type="primary" 
        onClick={handleSaveFile} 
        disabled={!file} 
        style={{ margin: '10px 0' }}
      >
        Save File
      </Button>
      <Table columns={columns} dataSource={tableData} />
    </>
  );
}

export default Upload;
