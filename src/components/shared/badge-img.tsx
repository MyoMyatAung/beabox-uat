import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const decryptImage = async (arrayBuffer: any, key = 0x12, decryptSize = 4096) => {
  const data = new Uint8Array(arrayBuffer);
  const maxSize = Math.min(decryptSize, data.length);
  for (let i = 0; i < maxSize; i++) {
    data[i] ^= key;
  }
  const decryptedStr = new TextDecoder().decode(data);
  
  // Convert the data URL to a Blob and create a blob URL
  if (decryptedStr.startsWith('data:')) {
    try {
      // Extract mime type and base64 data
      const matches = decryptedStr.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        throw new Error('Invalid data URL format');
      }
      
      const mimeType = matches[1];
      const base64Data = matches[2];
      
      // Convert base64 to binary
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Create Blob and blob URL
      const blob = new Blob([bytes], { type: mimeType });
      return URL.createObjectURL(blob);
    } catch (err) {
      console.error('Error converting data URL to blob:', err);
      // Fall back to data URL if conversion fails
      return decryptedStr;
    }
  }
  
  return decryptedStr;
};

const BadgeImg = ({ photo }: any) => {
  const user = useSelector((state: any) => state?.persist?.user);
  const [decryptedPhoto, setDecryptedPhoto] = useState("");

  useEffect(() => {
    const loadAndDecryptPhoto = async () => {
      if (!photo) {
        setDecryptedPhoto("");
        return;
      }

      try {
        const photoUrl = photo;

        // If it's not a .txt file, assume it's already a valid URL
        if (!photoUrl.endsWith(".txt")) {
          setDecryptedPhoto(photoUrl);
          return;
        }

        // Fetch encrypted image data
        const response = await fetch(photoUrl);
        const arrayBuffer = await response.arrayBuffer();

        // Decrypt the data and convert to blob URL if it's a data URL
        const decryptedUrl = await decryptImage(arrayBuffer);
        setDecryptedPhoto(decryptedUrl);
      } catch (error) {
        console.error("Error loading profile photo:", error);
        setDecryptedPhoto("");
      }
    };

    loadAndDecryptPhoto();
    
    // Clean up blob URLs when component unmounts or data changes
    return () => {
      if (decryptedPhoto && decryptedPhoto.startsWith('blob:')) {
        URL.revokeObjectURL(decryptedPhoto);
      }
    };
  }, [photo, user?.token]);

  return <img className="w-5" src={decryptedPhoto} alt="" />;
};

export default BadgeImg;
