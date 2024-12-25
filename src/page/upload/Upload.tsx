import React from "react";
import UploadComputer from "../../assets/icons/UploadComputer.svg";
import UploadPhone from "../../assets/icons/UploadPhone.svg";
import Photography from "../../assets/icons/Photography.png";

const UploadComponent: React.FC = () => {
  return (
    <>
      <div className="flex flex-row justify-center">
        <h1 className="text-xl font-bold mt-6">Select Upload Method</h1>
      </div>

      <div className="bg-black text-white min-h-screen flex flex-col items-center mt-20">
        <div className="space-y-6">
          {/* Upload from Computer Option */}
          <div className="rounded-lg flex items-center justify-between w-80 shadow-md">
            <img src={UploadComputer} alt="Computer Icon" />
          </div>
          <p className="text-center text-sm text-gray-400">
            PC upload is available, <br /> Please copy the link to login.
          </p>
          <p className="text-center text-sm text-[#CD3EFF] no-underline cursor-pointer">
            http://d.23abcd.me
          </p>
          {/* Upload from Mobile Option */}
          <div className="rounded-lg flex items-center justify-between w-80 shadow-md">
            <img src={UploadPhone} alt="Phone Icon" />
          </div>
        </div>
        {/* Photography Tips */}
        <div className="mt-10">
          <img src={Photography} alt="Tip Icon" />
        </div>
      </div>
    </>
  );
};

export default UploadComponent;
