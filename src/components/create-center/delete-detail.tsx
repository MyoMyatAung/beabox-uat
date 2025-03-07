import { useState } from "react";

const DeleteDetailPopUp = ({ setShow }: any) => {
  return (
    <div className="z-50 h-screen w-full fixed top-0 left-0 bg-[#000000CC] flex justify-center items-center transition-all duration-75 ease-in-out">
      <div className="bg-[#16131C] rounded-[16px] flex flex-col justify-center items-center">
        <div className="pt-5 px-5">
          <p className="text-[16px] text-[#BBBBBB] text-center">
            Are you sure you want to remove this<br /> video? It will be moved to the
            recycle<br /> bin for 30 days and permanently deleted<br /> after that.
          </p>
        </div>
        <div className="bg-[#222222] h-[0.3px] mt-5 w-full"></div>
        <div className="flex h-[56px] w-full">
          <button onClick={() => setShow(false)} className="flex-1 text-[17px]">
            取消
          </button>
          <div className="bg-[#222222] w-[0.3px] h-100"></div>
          <button
            onClick={() => setShow(false)}
            className="flex-1 text-[17px] text-[#C23033]"
          >
            消除
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteDetail = () => {
  const [show, setShow] = useState(false);
  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="text-[16px] text-[#C23033]"
      >
        Delete
      </button>
      {show ? <DeleteDetailPopUp setShow={setShow} /> : <> </>}
    </>
  );
};

export default DeleteDetail;
