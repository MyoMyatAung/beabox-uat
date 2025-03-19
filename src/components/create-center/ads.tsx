import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { useGetAdsQuery } from "@/store/api/createCenterApi";

const Ads = () => {
  const [imageSrc, setImageSrc] = useState("");
  const [encryptedData, setEncryptedData] = useState("");
  const { data } = useGetAdsQuery("");
  const secretKey = "my_secret_key"; // Ensure you use the same key used for encryption

  const fetchAndEncrypt = async (imgurl: any) => {
    try {
      const response = await fetch(imgurl);
      const blob = await response.blob();

      const reader: any = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64 = reader.result.split(",")[1]; // Remove data:image/*;base64,
        const secretKey = "my_secret_key"; // Change to a secure key
        const encrypted = CryptoJS.AES.encrypt(base64, secretKey).toString();
        setEncryptedData(encrypted);
        decryptAndDisplay(encrypted);
        console.log("Encrypted Image:", encrypted);
      };
    } catch (error) {
      console.error("Error fetching or encrypting image:", error);
    }
  };

  const decryptAndDisplay = (ecdata: any) => {
    try {
      const decrypted = CryptoJS.AES.decrypt(ecdata, secretKey).toString(
        CryptoJS.enc.Utf8
      );

      if (!decrypted) {
        throw new Error("Decryption failed. Check the secret key.");
      }

      setImageSrc(`data:image/jpeg;base64,${decrypted}`);
    } catch (error) {
      console.error("Error decrypting image:", error);
    }
  };

  console.log(imageSrc, "test");

  useEffect(() => {
    fetchAndEncrypt(data?.data?.create_center_page?.image);
  }, [data]);

  return (
    <div>
      <img src={imageSrc} alt="" />
    </div>
  );
};

export default Ads;
