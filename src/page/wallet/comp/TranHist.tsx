import React, { useEffect, useState } from "react";
import Header from "../Header";
import empty from "./empty.svg";
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
import { useLocation } from "react-router-dom";

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
  const location = useLocation();
  const pageHead = location.pathname === "/wallet/income" ? "收入" : "转账历史";
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
        <Header lv={false} title={pageHead} />
        <div className="px-[20px] py-[16px] flex justify-center items-center">
          {/* <TypePick /> */}
        </div>
        {/* time */}
        <div className=" fixed bg-[#201c25] w-full">
          <DatePick
            setTran={setTran}
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
                  alt="加载中"
                />
              </div>
            </div>
          ) : (
            <>
              {data?.data.length === 0 || tran.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-[600px] gap-[16px]">
                  <img src={empty} alt="" />
                  <div className=" flex flex-col justify-center items-center">
                    <h1 className="text-white font-[400] text-[14px]">
                      {location.pathname === "/wallet/income" ? "暂无转账" : ""}
                    </h1>
                    <span className=" text-[#888] text-[12px] font-[400]">
                      {" "}
                      {location.pathname === "/wallet/income"
                        ? "您的收入记录将在这里显示"
                        : "您还没有任何过渡记录"}{""}
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  {tran?.map((ts: any, index: any) => (
                    <div
                      key={index}
                      className="transit_list py-[16px] flex justify-between"
                    >
                      <div className="flex gap-[12px] items-center">
                        <div className="bitcoin_border w-[56px] h-[56px] flex justify-center items-center">
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
                            className="px-[12px] py-[6px] flex justify-center items-center rounded-[6px]  text-[12px] font-[400] leading-[15px]"
                          >
                            {ts.status === "approved" && "已批准"}
                            {ts.status === "pending" && "待处理"}
                            {ts.status === "rejected" && "已拒绝"}
                            {ts.status === "success" && "成功"}
                            {ts.status === "failed" && "失败"}
                            {ts.status === "default" && "默认"}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
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
                      <div className="fle bg-whit hidden pt-20 justify-center items-center  w-screen absolute bottom-[-20px] left-[-20px]">
                        <p className="py-10" style={{ textAlign: "center" }}>
                          <b>没有更多了！</b>
                        </p>
                      </div>
                    }
                  >
                    <></>
                  </InfiniteScroll>
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
