import React, { useEffect, useState } from "react";
import Header from "../Header";
import { FaCaretDown } from "react-icons/fa";
import "../wallet.css";
import transit from "../../../assets/wallet/ transit.png";
import noTran from "../../../assets/wallet/noTran.svg";
import { useGetTransitionHistoryQuery } from "@/store/api/wallet/walletApi";
import DatePick from "./DatePick";
import TypePick from "./TypePick";

interface TranHistProps {}

const TranHist: React.FC<TranHistProps> = ({}) => {
  const [curMon, setCurMon] = useState("December");
  const [curYr, setCurYr] = useState(2024);
  const [plus, setplus] = useState(12);
  const [tran, setTran] = useState<any>();
  const { data, isLoading } = useGetTransitionHistoryQuery({
    period: `${plus}-${curYr}`,
    type: "topup",
  });
  useEffect(() => {
    if (data?.data) {
      setTran(data?.data);
    }
  }, [data]);
  console.log(plus);
  return (
    <div className=" flex justify-center items-center">
      <div className="w-screen xl:w-[800px]">
        <Header lv={false} title="Transition History" />
        <div className=" px-[20px] flex justify-center items-center">
          {/* types */}
          <TypePick />
        </div>
        {/* time */}
        <DatePick
          curMon={curMon}
          curYr={curYr}
          setCurMon={setCurMon}
          setCurYr={setCurYr}
          setplus={setplus}
        />
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
