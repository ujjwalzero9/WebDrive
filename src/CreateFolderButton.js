import React, { useState } from 'react';
import axios from 'axios';

function CreateFolderButton({ userId, folderPath }) {
  const [folderName, setFolderName] = useState('');

  const handleCreateFolder = async () => {
    try {
      // Create a payload for both create entity and get entities APIs
      const payload = {
        user_id: userId,
        folder_path: folderPath, // Use the provided folderPath
        name: folderName,
        is_folder: true,
      };

      // Make an API request to create a new folder entity
      await axios.post('https://ujjwalzero7.pythonanywhere.com/api/create_entity/', payload);

      // Clear the input field after successfully creating the folder
      setFolderName('');

      // Show a pop-up message indicating the folder was created successfully
      alert(`Folder "${folderName}" has been successfully created.`);

      // Make an API request to get entities using the same payload
      await axios.post('https://ujjwalzero7.pythonanywhere.com/api/get_entities/', payload);

      // Trigger a refresh of the folder contents
      window.location.reload();

    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  return (
    <div>
      <h2>Create Folder</h2>
      <input
        type="text"
        placeholder="Enter folder name"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
      />
      <button onClick={handleCreateFolder}>Create Folder</button>
    </div>
  );
}

export default CreateFolderButton;
