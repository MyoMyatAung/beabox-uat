import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPanding } from "../store/slices/ModelSlice";

import splashLogo from "../assets/splashLogo.svg";
import '../page/search/search.css'
import { useGetAdsPopUpQuery } from "@/utils/helperService";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";

const Landing: React.FC = () => {
  const dispatch = useDispatch();
  const [cc, setCc] = useState<any>();
  const [skip, setSkip] = useState(3);
  const [images, setImages] = useState<any>();
  const { data, isLoading } = useGetAdsPopUpQuery();
  const [imgLoad, setImgLoad] = useState(false);

  useEffect(() => {
    if (data?.data) {
      const cur = data?.data.splash_screen;
      if (cur) {
        setCc(cur);
        setImages(cur);
      }
      const timer = setTimeout(() => {
        dispatch(setPanding(false));
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [data, images, dispatch]);

  useEffect(() => {
    if (imgLoad) {
      const countdown = setInterval(() => {
        if (skip > 0) {
          setSkip((prev) => prev - 1);
        } else {
          dispatch(setPanding(false));
        }
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [skip, imgLoad, dispatch]);

  return (
    <>
      <a target="_blank" rel="noopener noreferrer" href={images?.jump_url}>
        {/* Optional overlay while image is loading */}
        {!imgLoad && (
          <div className="absolute inset-0 bg-search-img"></div>
        )}
        <AsyncDecryptedImage
          className="h-screen w-screen object-cover"
          onLoad={() => setImgLoad(true)}
          imageUrl={images?.image}
          alt=""
        />
        {/* Centered splash logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img src={splashLogo} alt="Splash Logo" style={{width: '199px', height: '68px'}} />
        </div>
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
