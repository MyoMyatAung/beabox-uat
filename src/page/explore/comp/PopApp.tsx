/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import pizza from "../../../assets/explore/pizza.png";
import {
  useGetApplicationAdsQuery,
  useGetExploreHeaderQuery,
} from "@/store/api/explore/exploreApi";
import { Link, useLocation } from "react-router-dom";
import useCachedImage from "@/utils/useCachedImage";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";

interface AdItemProps {
  item: any;
}

const AdItemComponent: React.FC<AdItemProps> = ({ item }) => {
  const imageUrl = item?.image || "";
  const { imgSrc, isLoading: imageLoading } = useCachedImage(imageUrl);

  return (
    <Link
      target="_blank"
      className="flex flex-col w-full justify-center items-center gap-[4px]"
      to={item?.url || "#"}
    >
      {imageLoading && (
        <div className="w-[58px] h-[58px] object-cover rounded-[8px] mx-auto bg-white/15 animate-pulse flex justify-center items-center">
          <p className="text-[14px] font-[500] text-[#888]">{item?.remarks}</p>
        </div>
      )}
      {imgSrc && (
        <AsyncDecryptedImage
          imageUrl={imgSrc}
          className="w-[58px] h-[58px] object-cover rounded-[8px] mx-auto"
          alt="ad"
          loading="lazy"
        />
      )}
      <p className="text-[10px] font-[500] text-[#888]">{item?.title || ""}</p>
    </Link>
  );
};

interface PoppizzaProps {}

const Poppizza: React.FC<PoppizzaProps> = ({}) => {
  const location = useLocation()
  const [ad, setad] = useState([]);
  const { data, isLoading } = useGetExploreHeaderQuery("");
  // const { data: gg } = useGetApplicationAdsQuery("");
  // console.log(gg)
  useEffect(() => {
    if (data?.data) {
      console.log("data is=>", data?.data);
      const cur = data?.data?.ads?.application?.apps;
      setad(cur);
    }
    // if (gg?.data) {
    //   const cur = gg?.data.application[2].apps;
    //   // console.log(cur , "cur")
    //   setad(cur);
    // }
  }, [data]);
  // console.log(ad)

  return (
    <div className={` pt-[20px] ${location.pathname === "/settings" ? "" : "px-[10px]"}`}>
      <h1 className=" text-white text-[14px] font-[500] leading-[20px] pb-[12px] px-1">
        {data?.data?.ads?.application.title
          ? data?.data?.ads?.application.title
          : ""}
      </h1>
      {isLoading ? (
        <div className="grid grid-cols-6 gap-[20px]">
          <div className="w-[56px] h-[53px] rounded-md bg-white/20 animate-pulse"></div>
          <div className="w-[56px] h-[53px] rounded-md bg-white/20 animate-pulse"></div>
          <div className="w-[56px] h-[53px] rounded-md bg-white/20 animate-pulse"></div>
          <div className="w-[56px] h-[53px] rounded-md bg-white/20 animate-pulse"></div>
          <div className="w-[56px] h-[53px] rounded-md bg-white/20 animate-pulse"></div>
          <div className="w-[56px] h-[53px] rounded-md bg-white/20 animate-pulse"></div>
          <div className="w-[56px] h-[53px] rounded-md bg-white/20 animate-pulse"></div>
          <div className="w-[56px] h-[53px] rounded-md bg-white/20 animate-pulse"></div>
          <div className="w-[56px] h-[53px] rounded-md bg-white/20 animate-pulse"></div>
          <div className="w-[56px] h-[53px] rounded-md bg-white/20 animate-pulse"></div>
          <div className="w-[56px] h-[53px] rounded-md bg-white/20 animate-pulse"></div>
          <div className="w-[56px] h-[53px] rounded-md bg-white/20 animate-pulse"></div>
        </div>
      ) : (
        <div className=" grid grid-cols-6 gap-[5px]">
          {ad?.map((app: any) => (
            <a
              key={app.id}
              href={app.url}
              target="_blink"
              className=" flex flex-col justify-center items-center gap-[4px]"
            >
              <img
                className="min-w-[56px] min-h-[56px] rounded-[6px] border-[#222]"
                src={app.image}
                alt=""
              />
              <h1 className=" text-white ad_update text-[14px] font-[400]">
                {app.title}
              </h1>
            </a>
          ))}
          {/* {
            ad?.map((item, index) => (
              <AdItemComponent key={index} item={item} />
            ))
          } */}
        </div>
      )}
    </div>
  );
};

export default Poppizza;
