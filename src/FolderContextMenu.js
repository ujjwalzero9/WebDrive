import React from 'react';

function FolderContextMenu({ onDelete, onRename, top, left, isRenaming, renameName, setRenameName, onSaveRename }) {
  const contextMenuStyle = {
    position: 'fixed',
    top: top + 'px',
    left: left + 'px',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    minWidth: '120px',
    padding: '8px 0',
  };

  const menuItemStyle = {
    cursor: 'pointer',
    padding: '8px 16px',
    userSelect: 'none',
    transition: 'background-color 0.3s',
  };

  const menuItemHoverStyle = {
    backgroundColor: '#f0f0f0',
  };

  const handleDeleteClick = () => {
    const confirmation = window.confirm('Are you sure you want to delete this folder?');

    if (confirmation) {
      onDelete();
    }
  };

  const handleRenameClick = () => {
    onRename();
  };

  const handleSaveRename = () => {
    onSaveRename();
  };

  return (
    <div style={contextMenuStyle} className="context-menu">
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li
          style={menuItemStyle}
          onClick={handleRenameClick}
          onMouseOver={(e) => (e.target.style.backgroundColor = menuItemHoverStyle.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = '')}
        >
          Rename
        </li>
        <li
          style={menuItemStyle}
          onClick={handleDeleteClick}
          onMouseOver={(e) => (e.target.style.backgroundColor = menuItemHoverStyle.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = '')}
        >
          Delete
        </li>
      </ul>
      {isRenaming && (
        <div>
          <input
            type="text"
            value={renameName}
            onChange={(e) => setRenameName(e.target.value)}
            placeholder="New Name"
          />
          <button onClick={handleSaveRename}>Save</button>
        </div>
      )}
    </div>
  );
}

export default FolderContextMenu;
