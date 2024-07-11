// DataTable.js

import React from 'react';

const DataTable = ({ data }) => {
  if (!data.length) return <p>No data available</p>;

  const headers = data[0];

  return (
    <div className='excel-table-container'>
      <table className='excel-table'>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(1).map((row, index) => (
            <tr key={index}>
              {headers.map((header, index) => (
                <td key={index}>{row[index]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
