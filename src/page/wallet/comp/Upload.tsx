// import React, { useCallback, useState } from "react";
// import "../wallet.css";
// import { useDropzone } from "react-dropzone";
// import toast from "react-hot-toast";

// interface UploadProps {}

// const Upload: React.FC<UploadProps> = ({}) => {
//   const [files, setFiles] = useState([]);
//   const [thumbnail, setThumbnail] = useState(null);

//   // Handle thumbnail drop
//   const onThumbnailDrop = useCallback((acceptedFiles: any) => {
//     const thumbnailImage = acceptedFiles.find((file: any) =>
//       file.type.startsWith("image/")
//     );

//     if (acceptedFiles.length > 1) {
//       toast.error("你只能上传一个缩略图图像。", {
//         // You can only upload one image for the thumbnail.
//         style: {
//           background: "#25212a",
//           color: "white",
//         },
//       });
//       return;
//     }

//     if (thumbnailImage) {
//       setThumbnail(thumbnailImage);
//     } else {
//       toast.error("请上传一个有效的缩略图图像。", {
//         // Please upload a valid image for the thumbnail.
//         style: {
//           background: "#25212a",
//           color: "white",
//         },
//       });
//     }
//   }, []);

//   const {
//     getRootProps: getThumbnailRootProps,
//     getInputProps: getThumbnailInputProps,
//     open: openThumbnailDialog,
//   } = useDropzone({
//     accept: { "image/*": [] },
//     onDrop: onThumbnailDrop,
//     noClick: true, // Disable click behavior to fix iOS issues
//   });

//   return (
//     <div className=" grid grid-cols-4 pt-[12px]">
//       {/* upload btn */}
//       <div className="wallet_upload_box hidden px-[12px] py-[16px] flex justify-center items-center">
//         <div className=" p-[12px] m-[12px] upload_plus_btn flex justify-center items-center">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="18"
//             height="18"
//             viewBox="0 0 18 18"
//             fill="none"
//           >
//             <path
//               d="M10.0998 7.90007L16.7 7.90007C17.3073 7.90007 17.7997 8.39245 17.7997 8.99984C17.7997 9.60722 17.3073 10.0996 16.7 10.0996L10.0998 10.0996V16.6998C10.0998 17.3072 9.60739 17.7996 9 17.7996C8.39261 17.7996 7.90023 17.3072 7.90023 16.6998V10.0996L1.30005 10.0996C0.69266 10.0996 0.200276 9.60722 0.200276 8.99984C0.200276 8.39245 0.692659 7.90007 1.30005 7.90007L7.90023 7.90007V1.29988C7.90023 0.692497 8.39261 0.200113 9 0.200113C9.60739 0.200113 10.0998 0.692497 10.0998 1.29988L10.0998 7.90007Z"
//               fill="white"
//             />
//           </svg>
//         </div>
//       </div>
//       <div className="preview-container">
//         {thumbnail ? (
//           <div
//             className="thumbnail-preview"
//             style={{
//               position: "relative",
//               overflow: "hidden",
//               borderRadius: "8px",
//               backgroundColor: "#000",
//             }}
//           >
//             <img
//               src={
//                 typeof thumbnail === "string"
//                   ? thumbnail
//                   : URL.createObjectURL(thumbnail)
//               }
//               alt="thumbnail preview"
//               className="preview-image"
//               style={{
//                 objectFit: "cover",
//                 width: "80px",
//                 height: "h-[80px]",
//                 display: "block",
//               }}
//               onError={(e) => {
//                 console.error("Error loading thumbnail image");
//                 // If thumbnail fails to load, replace with a data URL
//                 const target = e.target as HTMLImageElement;
//                 target.onerror = null; // Prevent infinite error loop
//                 // Create a simple colored rectangle as fallback
//                 const canvas = document.createElement("canvas");
//                 canvas.width = 320;
//                 canvas.height = 240;
//                 const ctx = canvas.getContext("2d");
//                 if (ctx) {
//                   ctx.fillStyle = "#2980b9";
//                   ctx.fillRect(0, 0, canvas.width, canvas.height);
//                   target.src = canvas.toDataURL("image/jpeg");
//                 }
//               }}
//             />
//             <button
//               onClick={() => {
//                 // Just remove the thumbnail without affecting video poster
//                 setThumbnail(null);
//               }}
//               className="upload-progress1 w-[36px] h-[36px]"
//               style={{
//                 position: "absolute",
//                 top: "50%",
//                 left: "50%",
//                 transform: "translate(-50%, -50%)",
//                 zIndex: 2,
//               }}
//             >
//               <div className=" p-[12px]  upload_plus_btn flex justify-center items-center">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="14"
//                   height="14"
//                   viewBox="0 0 14 14"
//                   fill="none"
//                 >
//                   <path
//                     d="M7 5.44469L11.667 0.777656C12.0965 0.348168 12.7929 0.348168 13.2223 0.777656C13.6518 1.20714 13.6518 1.90348 13.2223 2.33297L8.55531 7L13.2223 11.667C13.6518 12.0965 13.6518 12.7929 13.2223 13.2223C12.7929 13.6518 12.0965 13.6518 11.667 13.2223L7 8.55531L2.33297 13.2223C1.90348 13.6518 1.20714 13.6518 0.777656 13.2223C0.348168 12.7929 0.348168 12.0965 0.777655 11.667L5.44469 7L0.777656 2.33297C0.348168 1.90348 0.348168 1.20714 0.777656 0.777656C1.20714 0.348168 1.90348 0.348168 2.33297 0.777656L7 5.44469Z"
//                     fill="white"
//                   />
//                 </svg>
//               </div>
//             </button>
//           </div>
//         ) : (
//           <div
//             {...getThumbnailRootProps()}
//             className="wallet_upload_box"
//             onClick={openThumbnailDialog}
//           >
//             <div className=" px-[12px] py-[16px] flex justify-center items-center">
//               <input {...getThumbnailInputProps()} />
//               <div className="flex flex-col items-center gap-2">
//                 <div className=" p-[12px] m-[12px] upload_plus_btn flex justify-center items-center">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="18"
//                     height="18"
//                     viewBox="0 0 18 18"
//                     fill="none"
//                   >
//                     <path
//                       d="M10.0998 7.90007L16.7 7.90007C17.3073 7.90007 17.7997 8.39245 17.7997 8.99984C17.7997 9.60722 17.3073 10.0996 16.7 10.0996L10.0998 10.0996V16.6998C10.0998 17.3072 9.60739 17.7996 9 17.7996C8.39261 17.7996 7.90023 17.3072 7.90023 16.6998V10.0996L1.30005 10.0996C0.69266 10.0996 0.200276 9.60722 0.200276 8.99984C0.200276 8.39245 0.692659 7.90007 1.30005 7.90007L7.90023 7.90007V1.29988C7.90023 0.692497 8.39261 0.200113 9 0.200113C9.60739 0.200113 10.0998 0.692497 10.0998 1.29988L10.0998 7.90007Z"
//                       fill="white"
//                     />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Upload;

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import "../wallet.css";

interface UploadProps {
  images: any;
  setImages: any;
}

const Upload: React.FC<UploadProps> = ({ images, setImages }) => {
  // const [images, setImages] = useState<File[]>([]);
  // console.log(images)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > 10) {
        toast.error("最多只能上传10张图片", {
          style: {
            background: "#25212a",
            color: "white",
          },
        });
        return;
      }

      const validImages = acceptedFiles.filter((file) =>
        file.type.startsWith("image/")
      );
      setImages((prev) => [...prev, ...validImages]);
    },
    [images]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
    noClick: true,
  });

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-4 gap-4 pt-4" {...getRootProps()}>
      {/* Upload button */}
      {images.length < 10 && (
        <div
          onClick={open}
          className="wallet_upload_box cursor-pointer flex flex-col items-center justify-center bg-gray-800 rounded-md p-4"
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <div className=" p-[12px] m-[12px] upload_plus_btn flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M10.0998 7.90007L16.7 7.90007C17.3073 7.90007 17.7997 8.39245 17.7997 8.99984C17.7997 9.60722 17.3073 10.0996 16.7 10.0996L10.0998 10.0996V16.6998C10.0998 17.3072 9.60739 17.7996 9 17.7996C8.39261 17.7996 7.90023 17.3072 7.90023 16.6998V10.0996L1.30005 10.0996C0.69266 10.0996 0.200276 9.60722 0.200276 8.99984C0.200276 8.39245 0.692659 7.90007 1.30005 7.90007L7.90023 7.90007V1.29988C7.90023 0.692497 8.39261 0.200113 9 0.200113C9.60739 0.200113 10.0998 0.692497 10.0998 1.29988L10.0998 7.90007Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Uploaded images */}
      {images.map((file, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-md bg-black"
          style={{ width: "80px", height: "80px" }}
        >
          {/* <img
            src={URL.createObjectURL(file)}
            alt={`upload-${index}`}
            className="w-full h-full object-cover"
          /> */}
          <img
            src={URL.createObjectURL(file)}
            // src={
            //   typeof thumbnail === "string"
            //     ? thumbnail
            //     : URL.createObjectURL(thumbnail)
            // }
            alt="thumbnail preview"
            className="preview-image"
            style={{
              objectFit: "cover",
              width: "80px",
              height: "h-[80px]",
              display: "block",
            }}
            onError={(e) => {
              console.error("Error loading thumbnail image");
              // If thumbnail fails to load, replace with a data URL
              const target = e.target as HTMLImageElement;
              target.onerror = null; // Prevent infinite error loop
              // Create a simple colored rectangle as fallback
              const canvas = document.createElement("canvas");
              canvas.width = 320;
              canvas.height = 240;
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.fillStyle = "#2980b9";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                target.src = canvas.toDataURL("image/jpeg");
              }
            }}
          />
          {/* <button
            onClick={() => handleRemoveImage(index)}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
          >
            ×
          </button> */}
          <button
            onClick={() => handleRemoveImage(index)}
            className="upload-progress1 w-[36px] h-[36px]"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2,
            }}
          >
            <div className=" p-[12px]  upload_plus_btn flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M7 5.44469L11.667 0.777656C12.0965 0.348168 12.7929 0.348168 13.2223 0.777656C13.6518 1.20714 13.6518 1.90348 13.2223 2.33297L8.55531 7L13.2223 11.667C13.6518 12.0965 13.6518 12.7929 13.2223 13.2223C12.7929 13.6518 12.0965 13.6518 11.667 13.2223L7 8.55531L2.33297 13.2223C1.90348 13.6518 1.20714 13.6518 0.777656 13.2223C0.348168 12.7929 0.348168 12.0965 0.777655 11.667L5.44469 7L0.777656 2.33297C0.348168 1.90348 0.348168 1.20714 0.777656 0.777656C1.20714 0.348168 1.90348 0.348168 2.33297 0.777656L7 5.44469Z"
                  fill="white"
                />
              </svg>
            </div>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Upload;
