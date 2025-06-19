import { FC, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
// import bridge, { MessageType } from "./bridge/Bridge";
import "./LuckySpinPage.css";
import "./game.css";
import { Record } from "./Record";
import { useBoolean } from "ahooks";
import penImg from '../../assets/pen.png';

type HeadProps = {
  title?: string;
};

export const GameHead = () => {
  const navigate = useNavigate();

  const [state, { toggle, setTrue, setFalse }] = useBoolean(false);

  return (
    <>
      <div className="w-full h-[64px] bg-transparent flex justify-between items-center p-4 relative">
        <div className="" onClick={() => navigate(-1)}>
          <img className="back" src="/svgs/back0.svg" alt="Back" />
        </div>
        <div className="flex justify-center items-center pl-14">
          <img src="/svgs/logo.svg" className="h-[2rem]" alt="" />
          <img src={penImg} className="h-[1.6rem]" alt="" />
        </div>
        <div className="frame-1321315592" onClick={toggle}>
          <div className="history">中奖记录</div>
        </div>
      </div>
      <Record show={state} onClose={setFalse} />
    </>
  );
};
