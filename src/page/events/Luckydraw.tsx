/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import FlipNumber from "./Flipnumber";
import backButton from "../../assets/backButton.svg";
import { useNavigate } from "react-router-dom";
import eventPage2 from "@/assets/eventpage02.jpg";
import eventHeader from "../../assets/eventHeader.png";
import CopySvg from "@/assets/icons/solar_copy.svg";
import DownloadSvg from "@/assets/icons/Download.svg";
import InviteCard from "./InviteCard";
import Rule from "./Rule";
import eventPage from "@/assets/eventpage.jpg";
import eventTitle from "@/assets/eventTitle.png";
import Pricebg from "@/assets/prizeBg.png";
import Paper from "@/assets/Paper.png";
import { EventDetail } from "@/@types/lucky_draw";
import DrawTime from "@/assets/draw_time.png";
import { timeFormatter, formatDateTime } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/shared/loader";
import { useLazyGetEventDetailsQuery, useLazyGetUserShareInfoQuery } from "@/store/api/events/eventApi";
import { useParams } from "react-router-dom";
import { decrementDuration, setDuration, setEventDetail } from "@/store/slices/eventSlice";
import { showToast } from "../home/services/errorSlice";
import { RootState } from "@/store/store";
import { startTimer, stopTimer } from "./timer"; 
import { Link } from "react-router-dom";
import { paths } from "@/routes/paths";
import { setIsDrawerOpen } from "@/store/slices/profileSlice";
import AuthDrawer from "@/components/profile/auth/auth-drawer";

const Luckydraw = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const eventDetailsData = useSelector((state: any) => state.event.eventDetail);
  const currentDuration = useSelector((state: RootState) => state.event.eventDetail?.event_end_time);
  const timeZone = useSelector((state: RootState) => state.event.eventDetail?.server_timezone)
  const durationRef = useRef(currentDuration);
  const [stats, setStats] = useState<EventDetail | null>(eventDetailsData);
  const [firstLoad, setFirstLoad] = useState(true);
  const user = useSelector((state: any) => state.persist.user);
  const isOpen = useSelector((state: any) => state.profile.isDrawerOpen);

  // const {
  //   data: newEventDetails,
  //   refetch,
  //   isUninitialized,
  // } = useLazyGetEventDetailsQuery(id || "", {
  //   skip: false,
  // });

  const [triggerGetUserShareInfo] = useLazyGetUserShareInfoQuery();
  const [triggerGetEventDetails] = useLazyGetEventDetailsQuery();


  useEffect(() => {
    if (eventDetailsData) {
      setStats(eventDetailsData);
    }
  }, [eventDetailsData]);

  useEffect(() => {
    durationRef.current = currentDuration;
  }, [currentDuration]);
  
  // useEffect(() => {
  //   startTimer(() => {
  //     if (durationRef.current > 0) {
  //       dispatch(decrementDuration());
  //     } else {
  //       stopTimer(); // Only stop when reaching 0
  //     }
  //   });
  
  //   return () => {
  //     console.log('Unmount, but NOT stop timer');
  //   };
  // }, [dispatch]);
  
  useEffect(()=> {
    if (currentDuration === 0) {
        getDetails()
    }
  }, [currentDuration, dispatch])

  if (!stats) {
    return <Loader />;
  }

  const getDetails = async () => {
    setFirstLoad(true)
    try {
      const eventDetails = await triggerGetEventDetails(id).unwrap();
      dispatch(setEventDetail(eventDetails?.data));
      if (eventDetails?.data?.event_start_time) {
        dispatch(setDuration(eventDetails?.data.event_start_time));
      }
    } catch (error) {
      console.error('Failed to fetch event details:', error);
    }
  }
  const remainPrizeDigits = stats?.remaining_amount?.padStart(5, "0").split("");
  // const time = timeFormatter.format(new Date(Number(currentDuration) || 0));
  const remainingTime = formatDateTime(currentDuration, timeZone);

  // const remainingTime = time.startsWith("00:") ? time.slice(3) : time;

  const handleCopyClick = async () => {
    if (!user?.token) {
      dispatch(setIsDrawerOpen(true));
      return;
    }
    try {
      const result = await triggerGetUserShareInfo('').unwrap();
      const contentUrl = result?.data?.content;
      if (isIOSApp()) {
        sendEventToNative("copyAppdownloadUrl", contentUrl);
      } else {
        navigator.clipboard.writeText(contentUrl).then(() => {
          dispatch(
            showToast({
              message: "复制成功",
              type: "success",
            })
          );
        });
      }
      dispatch(
        showToast({
          message: "复制成功",
          type: "success",
        })
      );
    } catch (error) {
      console.error("Failed to fetch user share info:", error);
      dispatch(
        showToast({
          message: "复制成功",
          type: "success",
        })
      );
    }
  };

  const isIOSApp = () => {
    return (
      (window as any).webkit &&
      (window as any).webkit.messageHandlers &&
      (window as any).webkit.messageHandlers.jsBridge
    );
  };

  const sendEventToNative = (name: string, text: string) => {
    if (
      (window as any).webkit &&
      (window as any).webkit.messageHandlers &&
      (window as any).webkit.messageHandlers.jsBridge
    ) {
      (window as any).webkit.messageHandlers.jsBridge.postMessage({
        eventName: name,
        value: text,
      });
    }
  };
  
  const handleWithdrawClick = () => {
    if (!user?.token) {
      dispatch(setIsDrawerOpen(true));
      return;
    }
    navigate(paths.wallet_withdraw);
  };

  return (
    <div className="relative max-w-[480px] min-h-screen bg-no-repeat items-center mx-auto">
      <div
        style={{
          backgroundImage: `url(${eventPage2}), url(${eventPage})`,
          backgroundSize: "contain, auto 100%",
          // backgroundPosition: "top center, bottom center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex items-center justify-between py-5 px-3 mx-4 ">
          <img
            src={backButton}
            alt=""
            onClick={() => navigate("/")}
            className="mt-2 w-5 h-5"
          />
          <div className="absolute left-1/2 transform -translate-x-1/2 mt-5">
            <img
              src={eventHeader}
              alt="Invite Friends Header"
              className="h-auto object-contain"
            />
          </div>
        </div>

        <div className="w-full max-w-md p-4 text-center mx-auto">
            <img
              src={eventTitle}
              alt="event title"
              className="mx-auto"
            />
          <div
            className="rounded-lg p-9 text-white mt-6  bg-cover bg-center bg-no-repeat flex flex-col gap-y-2"
            style={{
              backgroundImage: `url(${Pricebg})`,
            }}
          >
            <div className="flex justify-center mt-5 space-x-1">
              {remainPrizeDigits?.map((digit, index) => (
                <FlipNumber key={index} number={parseInt(digit)} firstLoad={firstLoad} />
              ))}
            </div>

            <div className="flex justify-center">
              <img src={DrawTime} className="w-20" />
            </div>
            <div className="text-sm mb-7 mx-auto">
              <div className="flex justify-center text-sm mb-2 mx-auto gap-1">
                <p className="flex gap-1">
                  {/* {remainingTime.split("").map((char, index) => (
                    <span className="font-[700]"
                      key={index}
                      style={{
                        background:
                          char !== ":"
                            ? "rgba(255, 255, 255, 0.2)"
                            : "transparent",
                        padding: char !== ":"? "4px 8px" : "4px 1px",
                        borderRadius: "4px",
                      }}
                    >
                      {char}
                    </span>
                  ))} */}
                  <span className="font-[700]"
                      style={{
                        background: "rgba(255, 255, 255, 0.2)",
                        padding:"4px 6px",
                        borderRadius: "4px",
                      }}
                    >
                     {remainingTime}
                    </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-5 ">
          <InviteCard />
          <button onClick={handleCopyClick}
            className="flex items-center text-black justify-center mt-6 w-full py-3 rounded-[8px] font-[700]"
            style={{
              background:
                "linear-gradient(180deg, #FFFFFF 0%, #FFC989 152.27%)",
            }}
          >
            <span className="text-[14px]">复制邀请链接</span>
            <img src={CopySvg} alt="Copy" className="ml-2" />
          </button>
        </div>

        <div
          className="mx-5 py-5 mt-8"
          style={{
            backgroundImage: `url(${Paper})`,
            backgroundSize: "auto 100%",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            maxHeight: '295px'
          }}
        >
          <div className="rounded-[12px] py-2 px-2 mt-8">
            <div
              className="rounded-[12px] w-full font-[700] p-3 text-[#4E4E4E] leading-[22px] font-sf mx-auto bg-transparent max-w-[305px]"
              style={{
                background:
                  "linear-gradient(180deg, #FFFFFF 0%, #FFC989 152.27%)",
              }}
            >
              <div className="grid grid-cols-3 px-1">
                <div className="text-center border-r-[1.5px] border-black/10">
                  <p className="text-[14px]">今日收益</p>
                  <p className="mt-2 text-[20px]">{stats.today_earnings } {stats.today_earnings !== '0' ? `¥` : ""}</p>
                </div>

                <div className="text-center border-r-[1.5px] border-black/10">
                  <p className="text-[14px]">邀请人数</p>
                  <p className="mt-2 text-[20px]">{stats.invited_people}</p>
                </div>

                <div className="text-center">
                  <p className="text-[14px]">已注册用户</p>
                  <p className="mt-2 text-[20px]">{stats.registered_users}</p>
                </div>
              </div>

              <div className="mx-7 my-4 border-b-[1.5px] border-black/10"></div>

              <div className="grid grid-cols-3 px-1">
                <div className="text-center border-r-[1.5px] border-black/10">
                  <p className="text-[14px]">累计收益</p>
                  <p className="mt-2 text-[20px]">{stats.cumulative_earnings } {stats.cumulative_earnings !== '0' ? `¥` : ""}</p>
                </div>

                <div className="text-center border-r-[1.5px] border-black/10">
                  <p className="text-[14px]">本月收益</p>
                  <p className="mt-2 text-[20px]">{stats.this_month_earnings } {stats.this_month_earnings !== '0' ? `¥` : ""}</p>
                </div>

                <div className="text-center">
                  <p className="text-[14px]">上月收益</p>
                  <p className="mt-2 text-[20px]"> {stats.last_month_earnings } {stats.last_month_earnings !== '0' ? `¥` : ""}</p>
                </div>
              </div>

              <button
                onClick={handleWithdrawClick}
                className="bg-red-500 text-white mt-4 w-full py-3 rounded-[8px] font-bold flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(166.1deg, #FF637D 45.09%, #F11F5D 65.22%, #FF1278 86.11%, #FF38B9 104.96%)",
                }}
              >
                立即提现
                <img src={DownloadSvg} className="ml-3" />
              </button>
            </div>
          </div>
        </div>
        <Rule />
      </div>
      {isOpen ? <AuthDrawer /> : <></>}
    </div>
  );
};

export default Luckydraw;
