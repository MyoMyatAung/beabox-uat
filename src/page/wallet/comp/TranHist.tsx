import React, { useEffect, useState } from "react";
import Header from "../Header";
import "../wallet.css";
import transit from "../../../assets/wallet/transit.png";
import noTran from "../../../assets/wallet/noTran.svg";
import { useGetTransitionHistoryQuery } from "@/store/api/wallet/walletApi";
import DatePick from "./DatePick";
import TypePick from "./TypePick";
import loader from "../../home/vod_loader.gif";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const TranHist: React.FC = () => {
  const [curMon, setCurMon] = useState("");
  const [curYr, setCurYr] = useState(0);
  const [plus, setPlus] = useState(0);
  const [tran, setTran] = useState<any>();

  useEffect(() => {
    const now = new Date();
    setCurMon(months[now.getMonth()]); // Get current month name
    setCurYr(now.getFullYear()); // Get current year
    setPlus(now.getMonth() + 1); // Month index starts from 0, so +1
  }, []);

  const { data, isLoading, isFetching } = useGetTransitionHistoryQuery({
    period: `${plus}-${curYr}`,
    type: "",
  });

  useEffect(() => {
    if (data?.data) {
      setTran(data?.data);
    }
  }, [data]);

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return {
          container: "success_state",
          text: "success_text",
        };
      case "pending":
        return {
          container: "pending_state",
          text: "pending_text",
        };
      case "failed":
        return {
          container: "failed_state",
          text: "failed_text",
        };
      default:
        return {
          container: "default_state",
          text: "default_text",
        };
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen xl:w-[800px]">
        <Header lv={false} title="Transition History" />
        <div className="px-[20px] py-[16px] flex justify-center items-center">
          {/* <TypePick /> */}
        </div>
        {/* time */}
        <DatePick
          curMon={curMon}
          curYr={curYr}
          setCurMon={setCurMon}
          setCurYr={setCurYr}
          setplus={setPlus}
        />
        {/* transition */}
        <div className="py-[12px] px-[18px]">
          {isLoading || isFetching ? (
            <div className=" flex justify-center items-center py-[100px]">
              <div className="heart">
                <img
                  src={loader}
                  className="w-[100px] h-[100px]"
                  alt="Loading"
                />
              </div>
            </div>
          ) : (
            <>
              {tran?.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-[600px]">
                  <img src={noTran} alt="" />
                  <h1 className="text-white font-[400] text-[14px]">
                    No Transition Yet
                  </h1>
                </div>
              ) : (
                tran?.map((ts: any) => (
                  <div
                    key={ts.id}
                    className="transit_list py-[20px] flex justify-between"
                  >
                    <div className="flex gap-[12px] items-center">
                      <div className="bitcoin_border p-3">
                        <img
                          className="w-[26px] h-[26px]"
                          src={transit}
                          alt=""
                        />
                      </div>
                      <div className="flex flex-col gap-[4px]">
                        <span className="text-white text-[14px] font-[500] leading-[20px]">
                          {ts.description}
                        </span>
                        <span className="text-[#777] text-[12px] font-[400] leading-[20px]">
                          {ts.date}
                        </span>
                      </div>
                    </div>
                    <div className=" flex flex-col justify-center items-center gap-[6px]">
                      <span>
                        {ts.dr_cr === "cr" ? "+" : "-"} {ts.amount}
                      </span>
                      {ts.status && (
                        <div
                          className={`${
                            getStatusClass(ts.status).container
                          } px-[12px] py-[2px] flex justify-center items-center`}
                        >
                          <span className={getStatusClass(ts.status).text}>
                            {ts.status}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranHist;
