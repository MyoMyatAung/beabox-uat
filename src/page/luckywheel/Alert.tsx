import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
// import bridge from "./bridge/Bridge";

type AlertProps = {
  msg: string;
  show: boolean;
  onClose: () => void;
  navBtn?: boolean;
  center?: boolean;
  btnText?: string;
  isCopy?: boolean;
  // eventId: any;
};

export const Alert: React.FC<AlertProps> = ({
  msg,
  show,
  onClose,
  navBtn,
  center,
  btnText,
  isCopy,
  // eventId,
}) => {
  // const navigate = useNavigate();
  const handleNavTask = () => {
    // navigate(`/events/lucky-draw/${eventId}`);
    // bridge.notifyRedEnvelope();
    // Handle navigation or task - placeholder for now
    onClose();
  };

  return (
    <Transition show={show} as={Fragment}>
      <Dialog open={true} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="z-20 fixed inset-0 bg-black/30" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed z-30 inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-80 max-w-sm rounded bg-white p-6 flex gap-4 flex-col">
                <Dialog.Title
                  className={
                    center
                      ? "text-base font-medium items-center justify-center flex"
                      : "text-base font-medium"
                  }
                >
                  {msg}
                  {isCopy && (
                    <button className="text-[#ff6a33] text-sm pt-3 w-full font-medium border-none">
                      复制内容
                    </button>
                  )}
                </Dialog.Title>
                <Dialog.Description className="flex gap-2">
                  {navBtn ? (
                    <>
                      <button
                        className="text-sm py-3 w-full text-black font-medium rounded border border-black/10"
                        onClick={onClose}
                      >
                        取消
                      </button>
                      <button
                        className="bg-[#ff6a33] text-sm py-3 w-full text-white font-medium rounded"
                        onClick={handleNavTask}
                      >
                        {btnText ? btnText : "获取积分"}
                      </button>
                    </>
                  ) : (
                    <button
                      className="bg-[#ff6a33] text-sm py-3 w-full text-white font-medium rounded"
                      onClick={onClose}
                    >
                      确定
                    </button>
                  )}
                </Dialog.Description>
              </Dialog.Panel>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};
