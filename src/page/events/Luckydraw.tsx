import React, { useEffect, useState } from "react";
import FlipNumber from "./Flipnumber";
import backButton from "../../assets/backButton.svg";
import { useNavigate } from "react-router-dom";
import eventPage2 from "@/assets/eventpage02.png";
import eventHeader from "../../assets/eventHeader.png";
import CopySvg from "@/assets/icons/solar_copy.svg";
import DownloadSvg from "@/assets/icons/Download.svg";
import InviteCard from "./InviteCard";
import Rule from "./Rule";
import eventPage from "@/assets/eventpage.png";
import eventTitle from "@/assets/eventTitle.png";
import groupImg from "@/assets/Group.png";
import Pricebg from "@/assets/icons/PrizeBg.svg";
import Paper from "@/assets/Paper.png";
import { EventDetail } from "@/@types/lucky_draw";
import DrawTime from "@/assets/draw_time.png";
import { timeFormatter } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/shared/loader";
import { useGetEventDetailsQuery } from "@/store/api/events/eventApi";
import { useParams } from "react-router-dom";
import { setEventDetail } from "@/store/slices/eventSlice";

const Luckydraw = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const eventDetailsData = useSelector((state: any) => state.event.eventDetail);

  const [stats, setStats] = useState<EventDetail | null>(eventDetailsData);

  const {
    data: newEventDetails,
    refetch,
    isUninitialized,
  } = useGetEventDetailsQuery(id || "", {
    skip: false,
  });

  useEffect(() => {
    if (eventDetailsData) {
      setStats(eventDetailsData);
    }
  }, [eventDetailsData]);
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => {
        if (prev) {
          const newDuration = prev.duration <= 1000 ? 0 : prev.duration - 1000;
          return {
            ...prev,
            duration: newDuration,
          };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (Number(stats?.duration) === 0 && !isUninitialized) {
      refetch().then((res) => {
        if (res?.data) {
          dispatch(setEventDetail(res.data.data));
          setStats(res.data.data);
        }
      });
    }
  }, [stats?.duration, newEventDetails, dispatch]);

  if (!stats) {
    return <Loader />;
  }

  const remainPrizeDigits = stats?.remaining_amount?.padStart(5, "0").split("");
  const time = timeFormatter.format(new Date(Number(stats?.duration) || 0));
  const remainingTime = time.startsWith("00:") ? time.slice(3) : time;

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
          <div className="relative mx-auto pb-3">
            <img
              src={eventTitle}
              alt="event title"
              className="mx-auto"
              style={{
                position: "relative",
                zIndex: 2,
              }}
            />
            <img
              src={groupImg}
              alt="group image"
              className="mx-auto"
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%) translateY(-60%)",
                opacity: 0.4,
                zIndex: 1,
              }}
            />
          </div>

          <div
            className="rounded-lg p-9 text-white mt-9  bg-cover bg-center bg-no-repeat flex flex-col gap-y-2"
            style={{
              backgroundImage: `url(${Pricebg})`,
            }}
          >
            <div className="flex justify-center mt-3 space-x-1">
              {remainPrizeDigits?.map((digit, index) => (
                <FlipNumber key={index} number={parseInt(digit)} />
              ))}
            </div>

            <div className="flex justify-center">
              <img src={DrawTime} className="w-20" />
            </div>
            <div className="text-sm mb-9 mx-auto">
              <div className="flex justify-center text-sm mb-2 mx-auto gap-1">
                <p className="flex gap-1">
                  {remainingTime.split("").map((char, index) => (
                    <span
                      key={index}
                      style={{
                        background:
                          char !== ":"
                            ? "rgba(255, 255, 255, 0.2)"
                            : "transparent",
                        padding: "4px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-5 pt-3">
          <InviteCard />
          <button
            className="flex items-center text-black justify-center mt-6 w-full py-3 rounded-[8px] font-700"
            style={{
              background:
                "linear-gradient(180deg, #FFFFFF 0%, #FFC989 152.27%)",
            }}
          >
            复制邀请链接
            <img src={CopySvg} alt="Copy" className="ml-2" />
          </button>
        </div>

        <div
          className="mx-6 py-5 mt-7"
          style={{
            backgroundImage: `url(${Paper})`,
            backgroundSize: "auto 100%",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            maxHeight: '280px'
          }}
        >
          <div className="bg-[#f14884] rounded-sm py-5 mt-8">
            <div
              className="rounded-lg w-full max-w-md p-4 text-black leading-[22px] font-sf mx-auto bg-transparent"
              style={{
                background:
                  "linear-gradient(180deg, #FFFFFF 0%, #FFC989 152.27%)",
              }}
            >
              <div className="grid grid-cols-3 gap-4 text-center text-sm pb-3"
                style={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}
              >
                <div style={{ borderRight: '2px solid rgba(0, 0, 0, 0.12)' }}>
                  <p>今日收益</p>
                  <p className="font-bold">{stats.today_earnings}</p>
                </div>
                <div style={{ borderRight: '2px solid rgba(0, 0, 0, 0.12)' }}>
                  <p>邀请人数</p>
                  <p className="font-bold">{stats.invited_people}</p>
                </div>
                <div>
                  <p>已注册用户</p>
                  <p className="font-bold">{stats.registered_users}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
                <div style={{ borderRight: '2px solid rgba(0, 0, 0, 0.12)' }}>
                  <p>累计收益</p>
                  <p className="font-bold">{stats.cumulative_earnings}</p>
                </div>
                <div style={{ borderRight: '2px solid rgba(0, 0, 0, 0.12)' }}>
                  <p>本月收益</p>
                  <p className="font-bold">{stats.this_month_earnings}</p>
                </div>
                <div>
                  <p>上月收益</p>
                  <p className="font-bold">{stats.last_month_earnings}</p>
                </div>
              </div>

              <button
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
    </div>
  );
};

export default Luckydraw;
