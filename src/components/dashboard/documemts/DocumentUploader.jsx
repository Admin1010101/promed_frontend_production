// DocumentUploader.js

import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';

const DocumentUploader = () => {
    const { uploadDocumentAndEmail } = useContext(AuthContext);
    // Change state to an array to hold multiple files
    const [selectedFiles, setSelectedFiles] = useState([]); 
    const [documentType, setDocumentType] = useState('MISCELLANEOUS');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [status, setStatus] = useState('');

    const handleFileChange = (event) => {
        // Store all selected files from the FileList
        setSelectedFiles(Array.from(event.target.files));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (selectedFiles.length === 0 || !recipientEmail) {
            setStatus('Please select at least one file and enter a recipient email.');
            return;
        }

        setStatus('Uploading and emailing...');
        // Pass the array of files to the new upload function
        const result = await uploadDocumentAndEmail(
            documentType,
            selectedFiles, // Pass the array
            recipientEmail
        );

        if (result.success) {
            setStatus('Files emailed successfully!');
            setSelectedFiles([]);
            setRecipientEmail('');
        } else {
            setStatus(`Failed: ${result.error}`);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Upload Documents for Review</h2>
            <select value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
                <option value="PROVIDER_RECORDS_REVIEW">Provider Records Review</option>
                <option value="MISCELLANEOUS">Miscellaneous</option>
            </select>
            <input type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="Recipient Email" required />
            {/* Add the 'multiple' attribute */}
            <input type="file" onChange={handleFileChange} multiple required />
            <button type="submit">Submit</button>
            <p>{status}</p>
        </form>
    );
};

export default DocumentUploader;