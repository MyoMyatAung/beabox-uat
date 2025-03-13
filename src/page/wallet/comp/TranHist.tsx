import React, { useEffect, useState } from "react";
import Header from "../Header";
import "../wallet.css";
import transit from "../../../assets/wallet/transit.png";
import noTran from "../../../assets/wallet/noTran.svg";
import {
  useGetInviteQuery,
  useGetTransitionHistoryQuery,
} from "@/store/api/wallet/walletApi";
import DatePick from "./DatePick";
import TypePick from "./TypePick";
import Loader from "../../../page/home/vod_loader.gif";
import loader from "../../home/vod_loader.gif";
import InfiniteScroll from "react-infinite-scroll-component";

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
  const [tran, setTran] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const [status, setStatus] = useState([]);
  const { data: config } = useGetInviteQuery("");

  useEffect(() => {
    const now = new Date();
    setCurMon(months[now.getMonth()]); // Get current month name
    setCurYr(now.getFullYear()); // Get current year
    setPlus(now.getMonth() + 1); // Month index starts from 0, so +1
  }, []);
  const { data, isLoading, isFetching } = useGetTransitionHistoryQuery({
    period: `${plus}-${curYr}`,
    type: "",
    page: page,
  });

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setTran([]);
  }, [curMon, curYr]);

  useEffect(() => {
    if (config?.data) {
      setStatus(config?.data?.transaction_status_list);
    }
  }, [config]);

  useEffect(() => {
    if (data?.data) {
      // setTran(data?.data);
      setTran((prev) => [...prev, ...data.data]);
      const loadedItems =
        data?.pagination?.current_page * data?.pagination?.per_page;
      setHasMore(loadedItems < data?.pagination?.total);
    } else {
      setHasMore(false);
    }
  }, [data]);

  // const getStatusClass = (status: string) => {
  //   switch (status.toLowerCase()) {
  //     case "approved":
  //       return {
  //         container: "success_state",
  //         text: "success_text",
  //       };
  //     case "pending":
  //       return {
  //         container: "pending_state",
  //         text: "pending_text",
  //       };
  //     case "rejected":
  //       return {
  //         container: "failed_state",
  //         text: "failed_text",
  //       };
  //     default:
  //       return {
  //         container: "default_state",
  //         text: "default_text",
  //       };
  //   }
  // };

  const getStatusClass = (keyword: string) => {
    const statusObj: any = status.find(
      (s: any) => s.keyword.toLowerCase() === keyword.toLowerCase()
    );
    return {
      backgroundColor: statusObj?.bg_color_code || "#777", // Default grey if not found
      color: statusObj?.text_color_code || "#FFF", // Default white if not found
    };
  };

  const fetchMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen xl:w-[800px]">
        <Header lv={false} title="Transition History" />
        <div className="px-[20px] py-[16px] flex justify-center items-center">
          {/* <TypePick /> */}
        </div>
        {/* time */}
        <div className=" fixed bg-gray-900 w-full">
          <DatePick
            curMon={curMon}
            curYr={curYr}
            setCurMon={setCurMon}
            setCurYr={setCurYr}
            setplus={setPlus}
          />
        </div>
        {/* transition */}
        <div className="py-[12px] px-[18px] mt-5">
          {isLoading ? (
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
                tran?.map((ts: any, index: any) => (
                  <div
                    key={index}
                    className="transit_list py-[16px] flex justify-between"
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
                          style={{
                            backgroundColor: getStatusClass(ts.status)
                              .backgroundColor,
                            color: getStatusClass(ts.status).color,
                          }}
                          className="px-[12px] py-[2px] flex justify-center items-center rounded-md  text-[12px] font-[400] leading-[15px]"
                        >
                          {/* <span
                            style={{}}
                            className=" text-[12px] font-[400] leading-[15px]"
                          > */}
                          {ts.status}
                          {/* </span> */}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              <InfiniteScroll
                className="py-[20px]"
                dataLength={tran.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={
                  <div className=" flex justify-center  bottom-[-30px] left-[-2px]">
                    <div className="">
                      <img
                        src={Loader}
                        className="w-[70px] h-[70px]"
                        alt="Loading"
                      />
                    </div>
                  </div>
                }
                endMessage={
                  <div className="flex bg-whit pt-20 justify-center items-center  w-screen absolute bottom-[-20px] left-[-20px]">
                    <p className="py-10" style={{ textAlign: "center" }}>
                      {/* <b>No more yet!</b> */}
                    </p>
                  </div>
                }
              >
                <></>
              </InfiniteScroll>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranHist;
