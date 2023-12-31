import React, { useState } from 'react';
import axios from 'axios';

function FileUploader() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    try {
      // Include your AWS S3 credentials and settings here
      const payload = {
        filename: selectedFile.name,
        AWS_ACCESS_KEY_ID: 'AKIAWBUEWYQO5KGVHBVY',
        AWS_SECRET_ACCESS_KEY: 'cGnk5q5O01yGUKoSl0qFOl81dddgcgqKkHyS69CY',
        AWS_STORAGE_BUCKET_NAME: 'backendc',
        AWS_S3_SIGNATURE_NAME: 's3v4',
        AWS_S3_REGION_NAME: 'us-east-1',
        AWS_S3_FILE_OVERWRITE: false,
        AWS_DEFAULT_ACL: null,
        DEFAULT_FILE_STORAGE: 'storages.backends.s3boto3.S3Boto3Storage',
      };

      // Make an API request to get a pre-signed URL from Django with the payload
      const response = await axios.post('http://127.0.0.1:8000/api/get_presigned_url/', payload);

      // Use the pre-signed URL to upload the file to AWS S3 as before
      const { url, fields } = response.data.post;
      const formData = new FormData();

      for (const key in fields) {
        formData.append(key, fields[key]);
      }

      formData.append('file', selectedFile);

      await fetch(url, {
        method: 'POST',
        body: formData,
      });

      alert('File uploaded successfully!');

      // Send the URL to your Django backend
      const imageURL = `https://backendc.s3.amazonaws.com/${selectedFile.name}`;

      // Make an API request to create the entity
      const createEntityResponse = await axios.post('http://127.0.0.1:8000/api/create_entity/', {
        name: selectedFile.name,
        content_type: 'File', // You can set this based on the file type
        url: imageURL,
        user_id: 1, // Update with the appropriate user ID
        folder_path: '/my_folder', // Update with the folder path where you want to create the entity
      });

      console.log(createEntityResponse);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An error occurred while uploading the file.');
    }
  };

  return (
    <div>
      <h2>File Uploader</h2>
      
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default FileUploader;
