import React, { useEffect, useState } from "react";
import "../wallet.css";
import { ChevronRight, ScrollText } from "lucide-react";
import transit from "../../../assets/wallet/transit.png";
import { useGetTransitionHistoryQuery } from "@/store/api/wallet/walletApi";
import noTran from "../../../assets/wallet/noTran.svg";
import { useNavigate } from "react-router-dom";
import loader from "../../home/vod_loader.gif";

interface TransitProps {}

const Transit: React.FC<TransitProps> = ({}) => {
  const navigate = useNavigate();
  const [tran, setTran] = useState<any>();
  const { data, isLoading } = useGetTransitionHistoryQuery({
    period: "",
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
    <div className=" py-[20px]">
      {/* header */}
      <div className="transit_header px-[20px] py-[10px] flex items-center justify-between">
        <h1 className=" text-white text-[14px] font-[500] leading-normal">
          明细
        </h1>
        <div
          onClick={() => navigate("/wallet/transition")}
          className="  flex transit_view_all pl-[10px] py-[2px] pr-[2px]"
        >
          <span className=" capitalize">查看全部</span>
          <ChevronRight />
        </div>
      </div>
      <div className=" py-[12px] px-[16px]">
        {isLoading ? (
          <div className=" flex justify-center items-center py-[100px]">
            <div className="heart">
              <img src={loader} className="w-[100px] h-[100px]" alt="Loading" />
            </div>
          </div>
        ) : (
          <>
            {data?.data.length === 0 ? (
              <div className=" flex flex-col justify-center items-center h-[300px]">
                <img src={noTran} alt="" />
                <h1 className=" text-white font-[400] text-[14px]">
                  No Transition Yet
                </h1>
              </div>
            ) : (
              <>
                {tran?.slice(0, 5).map((ts: any) => (
                  // {tran?.map((ts: any) => (
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
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Transit;
