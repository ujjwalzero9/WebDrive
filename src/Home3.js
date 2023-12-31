import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import CreateFolderButton from './CreateFolderButton';
import FileUploader2 from './FileUploader2';
import FolderContextMenu from './FolderContextMenu';
import FolderIcon from './folder.svg';
import FileImage from './fileImg.png';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function Home3() {
  const userId = sessionStorage.getItem('userid');
  const [folders, setFolders] = useState([]);
  const [folderHistory, setFolderHistory] = useState(['/']);
  const [selectedFolder, setSelectedFolder] = useState("testuser's Home");
  const navigate = useNavigate();

  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [selectedFolderForContextMenu, setSelectedFolderForContextMenu] = useState(null);

  const [isRenaming, setIsRenaming] = useState(false);
  const [renameName, setRenameName] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [fileUrl, setFileUrl] = useState('');

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const fetchData = useCallback((folderPath) => {
    axios
      .post('https://ujjwalzero7.pythonanywhere.com/api/get_entities/', { user_id: userId, folder_path: folderPath })
      .then((response) => {
        setFolders(response.data);
        setSelectedFolder(folderPath);
      })
      .catch((error) => {
        console.error('Error fetching folder structure:', error);
      });
  }, [userId]);

  useEffect(() => {
    fetchData('/');
  }, [fetchData]);

  const handleContextMenu = (event, folder) => {
    event.preventDefault();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setSelectedFolderForContextMenu(folder);
    setShowContextMenu(true);
  };

  const handleFolderClick = (folderPath) => {
    // If the clicked folderPath starts with '/', use it as is; otherwise, add '/'
    const updatedPath = folderPath.startsWith('/') ? folderPath : '/' + folderPath;

    fetchData(updatedPath);
    setFolderHistory((prevHistory) => [...prevHistory, updatedPath]);
  };

  const handleRename = () => {
    setIsRenaming(true);
  };

  const handleRenameSave = () => {
    if (!selectedFolderForContextMenu || !renameName) {
      console.error('Invalid or missing data for rename');
      return;
    }

    axios
      .put(`https://ujjwalzero7.pythonanywhere.com/api/rename_entity/`, {
        folder_id: selectedFolderForContextMenu.id,
        new_name: renameName,
      })
      .then((response) => {
        console.log(response.data.message);
        setShowContextMenu(false);
        fetchData(selectedFolder);
        setIsRenaming(false);
        setRenameName('');
      })
      .catch((error) => {
        console.error('Error renaming folder:', error);
        setShowContextMenu(false);
        setIsRenaming(false);
      });
  };

  const handleDeleteClick = () => {
    if (!selectedFolderForContextMenu || !selectedFolderForContextMenu.id) {
      console.error('Invalid or missing folder data for delete');
      return;
    }

    axios
      .delete(`https://ujjwalzero7.pythonanywhere.com/api/delete_entity/`, {
        data: { entity_id: selectedFolderForContextMenu.id },
      })
      .then((response) => {
        console.log(response.data.message);
        setShowContextMenu(false);
        fetchData(selectedFolder);
      })
      .catch((error) => {
        console.error('Error deleting folder:', error);
        setShowContextMenu(false);
      });
  };

  const openImage = (folder) => {
    if (!folder.is_folder) {
      axios
        .post(`https://ujjwalzero7.pythonanywhere.com/api/entity_details/`, { entity_id: folder.id })
        .then((response) => {
          const fileUrl = response.data.url;
          setFileUrl(fileUrl);
          setPopupVisible(true);
        })
        .catch((error) => {
          console.error('Error fetching file URL:', error);
        });
    } else {
      alert('This is not a file you can open directly.');
    }
  };

  const handleGoBack = () => {
    if (folderHistory.length > 1) {
      const newHistory = [...folderHistory];
      newHistory.pop();
      setFolderHistory(newHistory);
      const previousFolder = newHistory[newHistory.length - 1];
      fetchData(previousFolder);
    }
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  return (
    <div className="container">
      <div className="sidebar">
        <CreateFolderButton userId={userId} folderPath={selectedFolder} />
        <FileUploader2 userId={userId} folderPath={selectedFolder} refreshFiles={fetchData} />
      </div>
      <div className="content">
        <div className="header">
          <h1>{`Folder Structure - ${selectedFolder}`}</h1>
          <div className="button-container">
            <button className="back-button" onClick={handleGoBack}>
              Back
            </button>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
        <div className="folder-content">
          <ul className="folder-list">
            {folders.map((folder) => (
              <li key={folder.id}>
                <button
                  onContextMenu={(event) => handleContextMenu(event, folder)}
                  className={selectedFolder === folder.name ? 'selected-folder' : 'button'}
                  style={{
                    width: '150px',
                    height: '140px',
                    margin: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={() => {
                    if (folder.content_type === 'Folder') {
                      handleFolderClick(`/${folder.name}`);
                    } else {
                      openImage(folder);
                    }
                  }}
                >
                  {folder.content_type === 'Folder' ? (
                    <img src={FolderIcon} alt="Folder Icon" style={{ width: '80px', height: '80px' }} />
                  ) : (
                    <img src={FileImage} alt="File Icon" style={{ width: '80px', height: '80px' }} />
                  )}
                  <span style={{ color: 'black' }}>{folder.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {showContextMenu && (
        <FolderContextMenu
          onRename={handleRename}
          onDelete={handleDeleteClick}
          top={contextMenuPosition.y}
          left={contextMenuPosition.x}
          isRenaming={isRenaming}
          renameName={renameName}
          setRenameName={setRenameName}
          onSaveRename={handleRenameSave}
        />
      )}
      {popupVisible && (
        <div className="popup">
          <div className="popup-content">
            <img src={fileUrl} alt="File" />
            <a href={fileUrl} download>Download</a>
            <button className="close-button" onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home3;
