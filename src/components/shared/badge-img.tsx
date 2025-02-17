import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const decryptImage = (arrayBuffer: any, key = 0x12, decryptSize = 4096) => {
  const data = new Uint8Array(arrayBuffer);
  const maxSize = Math.min(decryptSize, data.length);
  for (let i = 0; i < maxSize; i++) {
    data[i] ^= key;
  }
  return new TextDecoder().decode(data);
};

const BadgeImg = ({ photo }: any) => {
  const user = useSelector((state: any) => state.persist.user);
  const [decryptedPhoto, setDecryptedPhoto] = useState("");

  useEffect(() => {
    const loadAndDecryptPhoto = async () => {
      if (!user?.token || !photo) {
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

        // Decrypt the first 4096 bytes and decode as text.
        const decryptedStr = decryptImage(arrayBuffer);

        // Set the decrypted profile photo source
        setDecryptedPhoto(decryptedStr);
      } catch (error) {
        console.error("Error loading profile photo:", error);
        setDecryptedPhoto("");
      }
    };

    loadAndDecryptPhoto();
  }, [photo, user?.token]);

  return <img className="w-5" src={decryptedPhoto} alt="" />;
};

export default BadgeImg;
