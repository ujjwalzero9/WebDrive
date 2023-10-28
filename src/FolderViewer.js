import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa'; // Import the trash icon
import CreateFolderButton from './CreateFolderButton';
import FileUploader2 from './FileUploader2';
import FolderIcon from './folder.svg'; // Import the folder icon
import FileIcon from './fileImg.png'; // Import the file icon

function FolderViewer({ userId }) {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("testuser's Home");
  const [folderEntities, setFolderEntities] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [folderHistory, setFolderHistory] = useState([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');

  useEffect(() => {
    fetchData('/');
  }, []);

  const fetchData = (folderPath) => {
    axios.post('http://127.0.0.1:8000/api/get_entities/', { user_id: userId, folder_path: folderPath })
      .then((response) => {
        setFolders(response.data);
        setSelectedFolder(folderPath);
        fetchFolderEntities(folderPath);
      })
      .catch((error) => {
        console.error('Error fetching folder structure:', error);
      });

    setFolderHistory((history) => [...history, folderPath]);
  };

  const fetchFolderEntities = (folderPath) => {
    axios.post('http://127.0.0.1:8000/api/get_entities/', { user_id: userId, folder_path: folderPath })
      .then((response) => {
        setFolderEntities(response.data);
      })
      .catch((error) => {
        console.error('Error fetching folder entities:', error);
      });
  };

  const goBack = () => {
    if (folderHistory.length > 1) {
      // Remove the last folder from history and navigate to the previous folder
      const previousFolder = folderHistory[folderHistory.length - 2];
      setFolderHistory((history) => history.slice(0, -1));
      fetchData(previousFolder);
    }
  };

  const goForward = () => {
    if (folderHistory.length > 1) {
      // Get the next folder in history and navigate to it
      const nextFolder = folderHistory[folderHistory.length - 1];
      fetchData(nextFolder);
    }
  };

  const deleteFolder = async (folderPath) => {
    try {
      // Make an API request to delete the folder
      await axios.delete(`http://127.0.0.1:8000/api/delete_entity${folderPath}`);

      // After deleting the folder, you can update the folder structure
      fetchData(selectedFolder); // Update the folder structure
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  const openGallery = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  const addNewFolder = async () => {
    try {
      // Make an API request to add a new folder in the selected folder
      await axios.post('http://127.0.0.1:8000/api/create_entity/', {
        user_id: userId,
        folder_path: selectedFolder,
        folder_name: newFolderName,
        is_folder: true,
      });

      // After adding the folder, fetch updated data for the selected folder
      fetchFolderEntities(selectedFolder);
      setNewFolderName('');
    } catch (error) {
      console.error('Error adding folder:', error);
    }
  };

  return (
    <div>
      <h1>Folder Structure</h1>
      <div>
        <button onClick={goBack}>Back</button>
        <button onClick={goForward}>Forward</button>
      </div>
      <ul>
        {folders.map((folder) => (
          <li key={folder.id}>
            <div className="folder">
              <button
                className={selectedFolder === folder.name ? 'selected-folder' : ''}
                onClick={() => fetchData(`/${folder.name}`)}
              >
                <img src={folder.is_folder ? FolderIcon : FileIcon} alt="Entity Icon" />
                {folder.name}
              </button>
              {!folder.is_folder && (
                <button
                  style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: 'blue', marginLeft: '5px', fontSize: '16px' }}
                  onClick={() => openGallery(folder.url)} // Use the 'url' property
                >
                  View Image
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {isGalleryOpen && (
        <ImageGallery imageUrl={selectedImageUrl} onCloseGallery={closeGallery} />
      )}
      <CreateFolderButton userId={userId} folderPath={selectedFolder} />
      <FileUploader2 userId={userId} folderPath={selectedFolder} refreshFiles={fetchData} />
    </div>
  );
}

export default FolderViewer;
