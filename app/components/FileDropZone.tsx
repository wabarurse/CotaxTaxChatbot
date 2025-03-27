function FileDropZone({
  dragActive,
  handleDrag,
  handleDrop,
  fileInputRef,
  files,
  onRemoveFile,
}: {
  dragActive: boolean
  handleDrag: (e: React.DragEvent<HTMLFormElement | HTMLDivElement>) => void
  handleDrop: (e: React.DragEvent<HTMLFormElement | HTMLDivElement>) => void
  fileInputRef: React.RefObject<HTMLInputElement>
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  files: File[] | null
  onRemoveFile: (index: number) => void
}) {
  const renderFilePreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      return (
        <div className="relative w-16 h-16 mr-4 mb-4 overflow-hidden rounded-md shadow-sm">
          <img 
            src={URL.createObjectURL(file)} 
            alt={file.name}
            className="w-full h-full object-cover"
            onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
          />
        </div>
      );
    }
    
    return (
      <div className="relative w-16 h-16 mr-4 mb-4 flex items-center justify-center bg-gray-100 rounded-md shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
    );
  };

  const handleAddMoreFiles = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.setAttribute('data-mode', 'append');
      
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 50);
    }
  };

  return (
    <div
      className={`p-3 border border-dashed rounded-lg text-center cursor-pointer transition-all ${dragActive ? "border-[#3D54A0] bg-indigo-50" : "border-gray-200 hover:border-indigo-300"
        }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={(e) => {
        if (e.currentTarget === e.target) {
          if (fileInputRef.current) {
            fileInputRef.current.removeAttribute('data-mode');
            fileInputRef.current.click();
          }
        }
      }}
    >
      
      {(!files || files.length === 0) ? (
        <p className="text-sm text-gray-500 mb-0">
          <span className="text-[#3D54A0]">Drag & drop</span> files or <span className="text-[#3D54A0]">click</span> to
          select
        </p>
      ) : (
        <div className="text-left p-2" onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-wrap gap-4">
            {Array.from(files).map((file, index) => (
              <div key={`${file.name}-${index}`} className="relative group">
                {renderFilePreview(file)}
                <button 
                  type="button"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-75 group-hover:opacity-100 transition-opacity shadow-sm"
                  onClick={() => onRemoveFile(index)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              className="w-16 h-16 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md text-gray-400 hover:text-[#3D54A0] hover:border-[#3D54A0] mr-4 mb-4"
              onClick={handleAddMoreFiles}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileDropZone