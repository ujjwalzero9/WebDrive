import React from 'react';

function ImageViewer({ imageUrl, onClose }) {
  return (
    <div className="image-viewer">
      <div className="image-container">
        <img src={imageUrl} alt="Image1" />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default ImageViewer;
