import { useState, useRef } from "react"


function useFileHandling() {
  const [files, setFiles] = useState<File[] | null>(null)
  const [dragActive, setDragActive] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>

  const handleDrag = (e: React.DragEvent<HTMLFormElement | HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLFormElement | HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (files) {
        // Append new files to existing ones
        const newFiles = Array.from(e.dataTransfer.files);
        const existingFiles = Array.from(files);
        setFiles([...existingFiles, ...newFiles]);
      } else {
        // No existing files, set as new files
        setFiles(Array.from(e.dataTransfer.files))
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Check if we're in append mode
      const isAppendMode = e.target.hasAttribute('data-mode') && 
                          e.target.getAttribute('data-mode') === 'append';
      
      if (isAppendMode && files) {
        // Append new files to existing ones
        const newFiles = Array.from(e.target.files);
        const existingFiles = Array.from(files);
        setFiles([...existingFiles, ...newFiles]);
        
        // Reset the attribute after use
        e.target.removeAttribute('data-mode');
      } else {
        // Standard replacement mode
        setFiles(Array.from(e.target.files));
      }
    }
  }

  const handleRemoveFile = (index: number) => {
    if (!files) return;
    const updatedFiles = Array.from(files).filter((_, i) => i !== index);
    if (updatedFiles.length === 0) {
      clearFiles();
    } else {
      setFiles(updatedFiles);
    }
  };

  const clearFiles = () => {
    setFiles(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return {
    files,
    dragActive,
    fileInputRef,
    handleDrag,
    handleDrop,
    handleFileChange,
    handleRemoveFile,
    clearFiles,
  }
}

export default useFileHandling