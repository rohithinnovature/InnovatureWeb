// import React from 'react';
// import * as XLSX from 'xlsx';
// import Papa from 'papaparse';
// import axios from 'axios';

// const FileUpload = ({ onDataUpload }) => {
//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];

//     if (file.type === 'text/csv') {
//       Papa.parse(file, {
//         chunk: (results) => {
//           onDataUpload(results.data); // Pass chunk of data back to parent component
//           console.log("sending");
//         },
//         complete: () => {
//           console.log('CSV parsing complete.');
//         },
//         error: (error) => {
//           console.error('Error parsing CSV:', error);
//         },
//       });
//     } else {
//       // For Excel files (both .xls and .xlsx), use XLSX for streaming parsing
//       const reader = new FileReader();

//       reader.onload = (event) => {
//         const binaryStr = event.target.result;
//         const workbook = XLSX.read(binaryStr, { type: 'binary', cellDates: true, sheetStubs: true });

//         workbook.SheetNames.forEach(sheetName => {
//           const sheet = workbook.Sheets[sheetName];
//           const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
//           onDataUpload(jsonData); // Pass sheet data back to parent component
//         });
//       };

//       reader.readAsBinaryString(file);
//     }
//   };

//   return (
//     <div className="file-upload-container">
//       <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
//     </div>
//   );
// };

// export default FileUpload;
