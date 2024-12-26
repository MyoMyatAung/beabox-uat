import React, { useEffect, useState } from "react";
import Header from "../Header";
import { FaCaretDown } from "react-icons/fa";
import "../wallet.css";
import transit from "../../../assets/wallet/ transit.png";
import noTran from "../../../assets/wallet/noTran.svg";
import { useGetTransitionHistoryQuery } from "@/store/api/wallet/walletApi";
import DatePick from "./DatePick";

interface TranHistProps {}

const TranHist: React.FC<TranHistProps> = ({}) => {
  const [tran, setTran] = useState<any>();
  const { data, isLoading } = useGetTransitionHistoryQuery({
    period: "12-2024",
    type: "topup",
  });
  useEffect(() => {
    if (data?.data) {
      setTran(data?.data);
    }
  }, [data]);
  return (
    <div className=" flex justify-center items-center">
      <div className="w-screen xl:w-[800px]">
        <Header lv={false} title="Transition History" />
        <div className=" px-[20px] flex justify-center items-center">
          {/* types */}
          <div className="types_all px-[16px] my-[10px] py-[8px] flex justify-center items-center gap-[4px]">
            <h1 className=" text-white text-[14px] font-[500] leading-[20px]">
              All Types
            </h1>
            <FaCaretDown />
          </div>
        </div>
        {/* time */}
        <DatePick />
        {/* <div className=" bg-white/5 w-full flex gap-[4px] items-center px-[20px] py-[8px]">
          <h1 className=" text-white text-[14px] font-[500] leading-[20px]">
            2024 October
          </h1>
          <FaCaretDown />
        </div> */}
        {/* transition */}
        <div className=" py-[12px] px-[18px]">
          {isLoading ? (
            <div className=" flex flex-col justify-center items-center h-[300px]">
              <img src={noTran} alt="" />
              <h1 className=" text-white font-[400] text-[14px]">
                Loading ...
              </h1>
            </div>
          ) : (
            <>
              {data?.data.length === 0 ? (
                <div className=" flex flex-col justify-center items-center h-[600px]">
                  <img src={noTran} alt="" />
                  <h1 className=" text-white font-[400] text-[14px]">
                    No Transition Yet
                  </h1>
                </div>
              ) : (
                <>
                  {tran?.map((ts: any) => (
                    <div
                      key={ts.id}
                      className=" transit_list py-[20px] flex justify-between"
                    >
                      <div className=" flex gap-[12px] items-center">
                        <div className="bitcoin_border p-3">
                          <img
                            className=" w-[26px] h-[26px]"
                            src={transit}
                            alt=""
                          />
                        </div>
                        <div className=" flex flex-col gap-[4px]">
                          <span className=" text-white text-[14px] font-[500] leading-[20px]">
                            {ts.description}
                          </span>
                          <span className=" text-[#777] text-[12px] font-[400] leading-[20px]">
                            {ts.date}
                          </span>
                        </div>
                      </div>
                      <div className="">
                        <span>+ {ts.amount}</span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranHist;
