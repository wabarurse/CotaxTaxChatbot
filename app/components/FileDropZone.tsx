function FileDropZone({
  dragActive,
  handleDrag,
  handleDrop,
  fileInputRef,
  handleFileChange,
  files,
}: {
  dragActive: boolean
  handleDrag: (e: React.DragEvent<HTMLFormElement | HTMLDivElement>) => void
  handleDrop: (e: React.DragEvent<HTMLFormElement | HTMLDivElement>) => void
  fileInputRef: React.RefObject<HTMLInputElement>
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  files: File[] | null
}) {
  return (
    <div
      className={`p-3 border border-dashed rounded-lg text-center cursor-pointer transition-all ${dragActive ? "border-[#3D54A0] bg-indigo-50" : "border-gray-200 hover:border-indigo-300"
        }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <p className="text-sm text-gray-500 mb-0">
        <span className="text-[#3D54A0]">Drag & drop</span> files or <span className="text-[#3D54A0]">click</span> to
        select
      </p>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,.pdf"
        multiple
      />
      {files && files.length > 0 && (
        <p className="text-xs mt-1 text-[#3D54A0]">
          {files.length} file{files.length > 1 ? "s" : ""} selected: {files.map((file) => file.name).join(", ")}
        </p>
      )}
    </div>
  )
}

export default FileDropZone