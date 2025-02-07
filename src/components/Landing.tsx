import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPanding } from "../store/slices/ModelSlice";

import ad1 from "../assets/explore/spl.png";
import { useGetAdsPopUpQuery } from "@/store/api/explore/exploreApi";
import '../page/search/search.css'

const Landing: React.FC = () => {
  const dispatch = useDispatch();
  const [cc, setCc] = useState<any>();
  const [skip, setSkip] = useState(3);
  const [images, setImages] = useState<any>();
  const { data, isLoading } = useGetAdsPopUpQuery("");
  // console.log(data)
  const [imgLoad, setImgLoad] = useState(false);

  useEffect(() => {
    if (data?.data) {
      const cur = data?.data.splash_screen;
      if (cur) {
        setCc(cur);
        // setImage(cur[0]?.data?.image)
        setImages(cur);
      }
      const timer = setTimeout(() => {
        dispatch(setPanding(false));
        // sendMessageToNative();
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [data, images]);

  useEffect(() => {
    if (imgLoad) {
      const countdown = setInterval(() => {
        if (skip > 0) {
          setSkip((prev) => prev - 1);
        } else {
          dispatch(setPanding(false));
          //   sendMessageToNative();
        }
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [skip, imgLoad]);

  console.log(imgLoad);

  return (
    <>
      <a target="_blink" href={images?.jump_url}>
        {!imgLoad && (
          <div className="absolute inset-0 bg-search-img"></div>
        )}
        <img
          className="h-screen w-screen object-cover"
          onLoad={() => setImgLoad(true)}
          src={images?.image}
          alt=""
        />
      </a>
      {imgLoad && (
        <div
          onClick={() => {
            dispatch(setPanding(false));
          }}
          style={{
            borderRadius: "52px",
            background: "rgba(0, 0, 0, 0.98)",
            backdropFilter: "blur(2px)",
          }}
          className="absolute top-[2vh] right-[2vh]"
        >
          <h1 className="text-white text-xs md:text-sm font-[400] py-[4px] px-[12px]">
            跳过广告 <span>{skip}</span>
          </h1>
        </div>
      )}
    </>
  );
};

export default Landing;
