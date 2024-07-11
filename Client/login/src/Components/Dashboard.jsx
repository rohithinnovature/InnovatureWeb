// Dashboard.js

import React, { useState } from 'react';
import './Dashboard.css'; // Import your CSS file for styling
import Topbar from "./Topbar";
import FileUpload from './FileUpload';
import DataTable from './DataTable';

const Dashboard = () => {
  const [uploadedData, setUploadedData] = useState([]);
  const [summaryData, setSummaryData] = useState(null);

  const handleDataUpload = (data) => {
    setUploadedData(data);
    calculateSummary(data);
  };

  const calculateSummary = (data) => {
    if (data.length === 0) {
      setSummaryData(null);
      return;
    }

    // Example: Calculate summary statistics (you can customize this)
    const totalRows = data.length;
    const totalColumns = data[0].length; // Assuming all rows have the same number of columns
    console.log(data[0][1])
    var avgo,avgh,avgl,avgc,absh = 0,absl = data[1][3];
    var toto = 0,toth = 0,totl = 0,totc = 0;

    for(var i=1 ; i < totalRows ; i++){
      toto = toto + data[i][1];
      totc = totc + data[i][4];
      if (data[i][2] > absh) {
        absh = data[i][2]
      }
      if (data[i][2] < absl) {
        absl = data[i][3]
      }
    }
    avgo = (toto/totalRows-1).toFixed(2);
    avgc = (totc/totalRows-1).toFixed(2);
    const summary = {
      totalRows: totalRows,
      totalColumns: totalColumns,
      avgo: avgo,
      avgc: avgc,
      absh: absh,
      absl: absl,
    };

    setSummaryData(summary);
  };

  return (
    <div>
      <Topbar logotext="Dashboard" />
      <div className="dashboard-container">
        <div className="left-half">
          <h2>Data Summary</h2>
          {summaryData ? (
            <div className="summary-list">
              <p>Number of Days: {summaryData.totalRows - 1}</p>
              {/* <p>Total Columns: {summaryData.totalColumns}</p> */}
              <p>Average Open: {summaryData.avgo}</p>
              <p>Average Close: {summaryData.avgc}</p>
              <p>High: {summaryData.absh}</p>
              <p>Low: {summaryData.absl}</p>
              
              {/* Add more summary details as needed */}
            </div>
          ) : (
            <p>No data uploaded yet</p>
          )}
        </div>
        <div className="right-half">
          <h2>Upload Excel File</h2>
          <FileUpload onDataUpload={handleDataUpload} />
          <h2>Uploaded Data</h2>
          <DataTable data={uploadedData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;