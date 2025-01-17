import { Camera } from "lucide-react";
import { Upload, X } from "lucide-react";

import { useState, useCallback } from "react";

const ImageUpload = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === "string") {
        setImage(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
  };

  return (
    // <div className="w-[80px] h-[80px] rounded-full bg-[#FFFFFF12] flex justify-center items-center mx-auto">
    //   <Camera />
    // </div>
    <div className="">
      <div>
        {image && (
          <div className="flex justify-center items-center relative">
            <img
              src={image || "/placeholder.svg"}
              alt="Preview"
              className="w-[80px] h-[80px] rounded-full bg-[#FFFFFF12] flex justify-center items-center object-cover object-center filter saturate-50 brightness-75"
            />
            <div className="absolute">
              <Camera />
            </div>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="image-upload"
        />
        {!image && (
          <label htmlFor="image-upload" className="">
            <div className="w-[80px] h-[80px] rounded-full bg-[#FFFFFF12] flex justify-center items-center mx-auto">
              <Camera />
            </div>
          </label>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
