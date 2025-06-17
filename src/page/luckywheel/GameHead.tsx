import { FC } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
// import bridge, { MessageType } from "../bridge/Bridge";
import "./LuckySpinPage.css";
import "./game.css";
import { Record } from "./Record";
import { useBoolean } from "ahooks";
// import { useBoolean } from "ahooks";
type HeadProps = {
  title?: string;
};

export const GameHead = ({ setShowLuckySpin }: any) => {
  const [state, { toggle, setTrue, setFalse }] = useBoolean(false);

  // const handleHistoryClick = () => {
  //   bridge.notifyHistoryRequested();
  //   bridge.sendToParent(MessageType.HISTORY_REQUESTED, {
  //     action: "click",
  //     timestamp: Date.now(),
  //   });
  // };
  // const handleBackClick = () => {
  //   bridge.notifyBackPressed();
  // };
  return (
    <>
      <div className="w-full h-[64px] bg-transparent flex justify-between items-center p-4 relative">
        <div className="" onClick={() => setShowLuckySpin(false)}>
          <img className="back" src="/svgs/back0.svg" alt="Back" />
        </div>
        <div className="flex justify-center items-center pl-14">
          <img src="/svgs/logo.svg" className="h-[2rem]" alt="" />
          <img src="/images/pen.png" className="h-[1.6rem]" alt="" />
        </div>
        <div
          className="frame-1321315592"
          onClick={toggle}
          // onClick={handleHistoryClick}
        >
          <div className="history">中奖记录</div>
        </div>
      </div>
      <Record show={state} onClose={setFalse} />
    </>
  );
};
