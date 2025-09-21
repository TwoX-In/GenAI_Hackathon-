






export function ImageUpload({images, setImages, isDragging, setIsDragging, inputRef}) {
    const handleFiles =(files)=>{
        const fileArray = Array.from(files);
        setImages((prevImages)=> prevImages.concat(fileArray));
    };
    const handleDrop=(e)=>{
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };
    const handleDragOver=(e)=>{
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave=(e)=>{
        e.preventDefault();
        setIsDragging(false);
    };
    const openFileDialog = () => inputRef.current?.click();

    const handleChange = (e) => handleFiles(e.target.files);

    return (
        <div
            className="`flex flex-col items-center 
            justify-center border-2 border-dashed border-black rounded-lg p-6 cursor-pointer w-full h-64`"
        
        >
            {/* Dropzone */}
                <div
                    onClick={openFileDialog}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                <p className="text-gray-600">📂 Drag & drop or click to upload</p>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={inputRef}
                    className="hidden"
                    onChange={handleChange}
                />


                </div>
            {/* Preview */}
            <div className="flex flex-wrap gap-2">
                {images?.map((img, i) => (
                    <div key={i} className="relative">
                        <img
                            src={URL.createObjectURL(img)}
                            alt="preview"
                            className="w-20 h-20 object-cover border"
                        />
                        <button
                            onClick={() =>
                                setImages(images.filter((_, index) => index !== i))
                            }
                            className="absolute top-0 right-0 bg-red-500 text-white px-1 text-xs"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );


}