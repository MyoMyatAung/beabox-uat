import React, { useEffect, useState } from "react";
import splashVideo from "@/assets/splash.mp4";
import logo from "@/assets/b_logo.webp";
import { useDispatch, useSelector } from "react-redux";
import { setuserFeedTags, setuserFeedText } from "@/store/slices/exploreSlice";
import { useGetConfigQuery } from "@/page/home/services/homeApi";
import { useNavigate } from "react-router-dom";
import { usePostPersonalizationMutation } from "@/store/api/profileApi";

interface UserFeedProps {}

const UserFeedSet: React.FC<UserFeedProps> = ({}) => {
  const [postPersonalization, { data, isLoading }] =
    usePostPersonalizationMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: config } = useGetConfigQuery("");
  console.log(config);
  const { userFeedText, userFeedTags } = useSelector(
    (state: any) => state.explore
  );
  console.log(userFeedTags);
  const [textLoad, setTextLoad] = useState(false);
  const [showText, setshowText] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showTags, setShowTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const [tags, settags] = useState([
    "mama",
    "young",
    "teen",
    "asian",
    "nigga",
    "JAV",
    "porn",
    "emiFukuda",
    "Jessica",
    "japan Beld",
  ]);

  const [hotText, setHotText] = useState([
    "i love gg",
    "i loge aa",
    "i love mia khalifa",
  ]);
  const [showProgress, setShoowProgress] = useState(false);
  useEffect(() => {
    setHotText(config?.data?.personalize_hot_text);
    settags(config?.data?.personalize_hot_tag);
  }, [config, hotText]);
  const [inputValue, setInputValue] = useState("");

  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handlStoreTags = () => {
    dispatch(setuserFeedTags(selectedTags));
    const data = postPersonalization({
      tags: selectedTags,
      interest: inputValue,
    });
    console.log(data);

    localStorage.setItem("isFirstTimeUser", "false");
    // setUserPers(false);
    // navigate(-1)
  };

  const handleStoreText = () => {
    setTextLoad(true);
    setTimeout(() => {
      dispatch(setuserFeedText(inputValue));
      setTextLoad(false);
      setshowText(false);
      setShoowProgress(true);

      // Start fake progress
      let p = 0;
      const interval = setInterval(() => {
        p += Math.floor(Math.random() * 10) + 5; // random step
        if (p >= 100) {
          p = 100;
          clearInterval(interval);
          // Optionally navigate or trigger next UI
          // e.g., navigate("/home")
          setShoowProgress(false);
          setShowTags(true);
        }
        setProgress(p);
      }, 200); // every 200ms
    }, 1500); // simulate delay
  };

  const skipFeed = () => {
    localStorage.setItem("isFirstTimeUser", "false");
    // setUserPers(false);

    navigate(-1);
  };
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-[9999] font-['Noto_Sans_SC',sans-serif]">
      <div className="w-full h-full relative overflow-hidden">
        {/* Video Background */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={splashVideo} type="video/mp4" />
        </video>

        {/* skip */}
        <div
          onClick={() => skipFeed()}
          className=" absolute z-[99994] right-4 top-6"
        >
          <h1 className=" text-white">跳过</h1>
        </div>

        {/* Blur Overlay */}
        <div className="absolute inset-0 backdrop-blur-md"></div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        {/* Content Container */}
        <div
          className={`relative z-10 flex flex-col items-center justify- ${
            showProgress ? " py-[200px]" : " py-[150px]"
          } h-full`}
        >
          {/* Logo */}
          <img
            className="w-[140px] mb-3 animate-[slideDown_1s_ease_forwards]"
            src={logo}
            alt="App Logo"
          />

          {/* interest */}
          {showText && (
            <div className="flex flex-col justify-normal w-full px-[20px]">
              <h1 className="text-white font-[400] text-[16px] py-4">
                What are you most interested in?
              </h1>

              <div className="user_feed_ques flex flex-col justify-end items-end p-[20px]">
                <textarea
                  placeholder="Use one sentence to describe your interests and we will generate exclusive content for you"
                  className="bg-transparent focus:outline-none text-white w-full h-[60px] resize-none placeholder:text-white/60 placeholder:text-[16px] leading-tight"
                  value={inputValue}
                  onChange={handleChange}
                />
                <button
                  onClick={() => handleStoreText()}
                  disabled={!inputValue.trim()}
                  className={`w-[59px] h-[32px] rounded-[16px] text-[16px] font-[500] transition flex justify-center items-center
            ${
              inputValue.trim()
                ? "user_feed_ques_btn"
                : "bg-black/30 text-white/30 cursor-not-allowed"
            }`}
                >
                  {textLoad ? (
                    <div className="border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin" />
                  ) : (
                    "继续"
                  )}
                </button>
              </div>

              <div className="user_feed_ques p-[15px] mt-2">
                {hotText?.map((pp, index) => (
                  <div
                    key={index}
                    className="flex gap-[12px] py-[4px] cursor-pointer"
                    onClick={() => handleSuggestionClick(pp)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="21"
                      viewBox="0 0 20 21"
                      fill="none"
                    >
                      <path
                        d="M13.8718 6.37842L15.0718 7.57842L11.0051 11.6451L8.26348 8.90342C7.93848 8.57842 7.41348 8.57842 7.08848 8.90342L2.08848 13.9118C1.76348 14.2368 1.76348 14.7618 2.08848 15.0868C2.41348 15.4118 2.93848 15.4118 3.26348 15.0868L7.67181 10.6701L10.4135 13.4118C10.7385 13.7368 11.2635 13.7368 11.5885 13.4118L16.2468 8.76175L17.4468 9.96175C17.7051 10.2201 18.1551 10.0368 18.1551 9.67009V6.08675C18.1635 5.85342 17.9801 5.67009 17.7468 5.67009H14.1718C13.7968 5.67009 13.6135 6.12009 13.8718 6.37842Z"
                        fill="white"
                      />
                    </svg>
                    <h1 className="text-white text-[14px] font-[400]">{pp}</h1>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showProgress && (
            <>
              {/* Progress Bar */}
              <h1 className=" p-[20px] text-white/80 text-[18px] font-[500] leading-[20px] text-center">
                Customized content will be generated according to the user's
                description
              </h1>
              <div className="w-4/5 text-center">
                <div className="w-full h-1.5 bg-white bg-opacity-15 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#de62f5] to-[#a848ec] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-sm text-white text-opacity-80">
                  正在为您加载最优线路{" "}
                  <span className="text-[#de62f5] font-bold ml-1">
                    {progress}%
                  </span>
                </div>
              </div>
            </>
          )}

          {showTags && (
            <div className=" flex flex-col px-[20px] justify-center items-center">
              <h1 className="text-white/80 text-[16px] font-[500] leading-[20px] text-center">
                Pick suggested categories that match your vibe fresh new content
                drops all the time. Enjoy now!
              </h1>
              <div className=" flex flex-wrap justify-center w-[300px] py-[10px]">
                {tags?.map((tt: any, index: number) => {
                  const isSelected = selectedTags.includes(tt);
                  return (
                    <div
                      key={index}
                      onClick={() => toggleTag(tt)}
                      className={`m-[6px] px-[12px] py-[6px] rounded-[16px] text-[14px] font-[400] cursor-pointer transition-all
        ${
          isSelected
            ? "bg-gradient-to-r from-[#CD3EFF] to-[#FFB2E0] text-white"
            : "bg-white/20 text-white/70"
        }`}
                    >
                      {tt}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer Text */}
          {showTags && (
            <button
              disabled={selectedTags.length === 0}
              onClick={() => handlStoreTags()}
              className={`absolute bottom-16 mx-[20px] py-[16px] w-[320px] rounded-[16px] text-[16px] font-[700] text-center transition-all
             ${
               selectedTags.length > 0
                 ? "bg-gradient-to-l from-[#CD3EFF] to-[#FFB2E0] text-white"
                 : "bg-white/20 text-white/50 cursor-not-allowed"
             }`}
            >
              Get Started
            </button>
          )}
          <div className="absolute bottom-4 w-full text-center text-xs text-white text-opacity-60 px-4">
            本软件不适合未成年人使用，如果您未满18岁请立刻离开。
            <br />© 笔盒@2025 ｜ 联系邮箱：zhaohui@beabox.net
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFeedSet;
