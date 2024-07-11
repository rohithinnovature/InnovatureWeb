// Upload.jsx

import React, { useRef } from "react";
import Topbar from "./Topbar";
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import axios from "axios";

const Upload = () => {
    const fileInputRef = useRef(null);
    let count = 0;

    async function pop_sql() {
        try{
            const response = await axios.post(`http://127.0.0.1:8000/authentication/pop_sql/`);
            console.log("sql function called successfully"+response.status);
        } catch (error){
            console.error('Error calling the function',error);
        }
    }; 

    const handleFileUpload = () => {
        const file = fileInputRef.current.files[0];

        if (!file) {
            console.error("No file selected.");
            return;
        }
        if (file.type === 'text/csv'){
            const chunkSize = 5 * 1024 * 1024; // 1MB chunk size (adjust as needed)
        let offset = 0;
        let chunkIndex = 0;

        async function uploadChunks() {
            while (offset < file.size) {
                const chunk = file.slice(offset, offset + chunkSize);
                const formData = new FormData();
                formData.append('file', chunk, `chunk-${chunkIndex}`);

                try {
                    const response = await axios.post('http://127.0.0.1:8000/authentication/get_head/', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });

                    console.log(`Chunk ${chunkIndex} uploaded successfully.`);
                    // Optionally handle response from backend

                    chunkIndex++;
                    offset += chunkSize;
                } catch (error) {
                    console.error(`Error uploading chunk ${chunkIndex}:`, error);
                    // Handle error (retry, notify user, etc.)
                    break; // Exit loop on error for simplicity
                }
            }

            console.log('File upload completed.');
            pop_sql();
        }

        // Call the asynchronous function
        uploadChunks();
        }

        // if (file.type === 'text/csv') {
        //     Papa.parse(file, {
        //         chunkSize: 50 * 1024 *1024,
        //         step: async (results, parser ) => {

        //             parser.chunkData = parser.chunkData || [];
        //             parser.chunkData.push(results.data);    
        //             if (parser.chunkData.length === 10000 || parser.finished) {
        //                 console.log("length of parser data after if "+ parser.chunkData.length)
        //                 parser.pause();
        //                 console.log('parser paused');
        //                 console.log(parser.chunkData);
        //                 // Pause parsing until current chunk is processed
        //                 console.log(parser.chunkData.length);
                
        //                 try {
        //                     // Call handleDataUpload with the accumulated data
        //                     const stat = await handleDataUpload(parser.chunkData);

        //                     console.log("stat"+stat);
                
        //                     // Clear accumulated data
        //                     parser.chunkData = [];

        //                     console.log("parser data after clearing"+parser.chunkData, parser.chunkData.length);
                
        //                     if (parser.finished) {
        //                         console.log('CSV parsing complete.');
                                // const pop_sql = async () => {
                                //     try{
                                //         const response = await axios.post(`http://127.0.0.1:8000/authentication/pop_sql/`);
                                //         console.log("sql function called successfully");
                                //     } catch (error){
                                //         console.error('Error calling the function',error);
                                //     }
                                // }; 
        //                     }
                            
        //                     // Resume parsing
        //                     console.log('resuming parsing');
        //                     parser.chunkData = [];
        //                     parser.resume();
        //                 } catch (error) {
        //                     console.error('Error handling chunk:', error);
        //                     parser.abort(); // Abort parsing on error
        //                 }
        //             } else {
        //                 if (parser.chunkData.length > 10000){
        //                     parser.chunkData = [];
        //                 }
        //                 parser.resume(); // Resume parsing the next chunk
        //             }
        //         },
        //         complete: function () {
        //             // Mark parsing as finished
        //             this.finished = true;
        //         },
        //         error: function (error) {
        //             console.error('Error parsing CSV:', error);
        //         }
        //     });
        //     }   
            else {
            // For Excel files (both .xls and .xlsx), use XLSX for streaming parsing
            const reader = new FileReader();

            reader.onload = (event) => {
                const binaryStr = event.target.result;
                const workbook = XLSX.read(binaryStr, { type: 'binary', cellDates: true, sheetStubs: true });

                workbook.SheetNames.forEach(sheetName => {
                    const sheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                    handleDataUpload(jsonData); // Handle sheet data
                });
            };

            reader.readAsBinaryString(file);
            }
    }

    const handleDataUpload = async (data, parser) => {
        try {
            console.log('in hadledataupload',data.length);
            const response = await axios.post(`http://127.0.0.1:8000/authentication/get_head/`, { data });
            console.log(response.data.status);
            if (response.data.status === '1') {
                console.log("Header sent successfully");
                return (response.data.status);
            } else {
                console.log("Not successful, sending again");
                handleDataUpload(data); // Retry sending data if not successful
            }
        } catch (error) {
            console.error('Error sending:', error);
            throw error;
        }
    };

    return (
        <div>
            <Topbar logotext="Upload File" />
            <h2>Upload File</h2>
            <div className="file-upload-container">
                <input type="file" accept=".xlsx, .xls, .csv" ref={fileInputRef} style={{ display: 'none' }} onChange={() => {}} />
                <button onClick={() => fileInputRef.current.click()}>Select File</button>
                <button onClick={handleFileUpload}>Upload</button>
            </div>
        </div>
    );
};

export default Upload;
