import React, { useEffect, useState } from 'react';

function FileList() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Replace 'your-api-endpoint' with the actual endpoint of your Django API.
    fetch('http://127.0.0.1:8000/folders/create/%3Cint:user_id%3E/')
      .then((response) => response.json())
      .then((data) => setFiles(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []); // The empty dependency array ensures this runs once on component mount.

  return (
    <div>
      <h2>Files</h2>
      <ul>
        {files.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default FileList;
