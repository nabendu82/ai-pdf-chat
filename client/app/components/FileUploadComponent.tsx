'use client';
import * as React from 'react';
import { Upload } from 'lucide-react'

const FileUploadComponent: React.FC = () => {
  const handleFileUploadButtonClick = () => {
    const el = document.createElement('input');
    el.setAttribute('type', 'file');
    el.setAttribute('accept', 'application/pdf');
    el.addEventListener('change', async (ev) => {
      if (el.files && el.files.length > 0) {
        const file = el.files.item(0);
        if (file) {
          const formData = new FormData();
          formData.append('pdf', file);
          await fetch('http://localhost:8000/upload/pdf', { method: 'POST', body: formData});
          console.log('File uploaded');
        }
      }
    });
    el.click();
  };

  return (
    <div className="bg-white text-gray-800 shadow-lg flex justify-center items-center p-6 rounded-lg border border-gray-200 transition hover:shadow-2xl cursor-pointer">
      <div onClick={handleFileUploadButtonClick} className="flex justify-center items-center flex-col">
        <h3 className="mb-2 font-semibold">Upload PDF File</h3>
        <Upload size={32} />
      </div>
    </div>
  );
};

export default FileUploadComponent;
