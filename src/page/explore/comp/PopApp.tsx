import React, { useEffect, useState } from "react";
import pizza from "../../../assets/explore/pizza.png";
import {
  useGetApplicationAdsQuery,
  useGetExploreHeaderQuery,
} from "@/store/api/explore/exploreApi";
interface PoppizzaProps {}

const Poppizza: React.FC<PoppizzaProps> = ({}) => {
  const [ad, setad] = useState([]);
  const { data, isLoading } = useGetExploreHeaderQuery("");
  // const { data: gg } = useGetApplicationAdsQuery("");
  // console.log(gg)
  useEffect(() => {
    if (data?.data) {
      const cur = data?.data?.ads?.application?.apps;
      setad(cur);
    }
    // if (gg?.data) {
    //   const cur = gg?.data.application[2].apps;
    //   // console.log(cur , "cur")
    //   setad(cur);
    // }
  }, [ad,data]);
  // console.log(ad)

  return (
    <div className=" pt-[20px]">
      <h1 className=" text-white text-[14px] font-[500] leading-[20px] pb-[12px]">
        {data?.data?.ads?.application.title
          ? data?.data?.ads?.application.title
          : "Popular App"}
      </h1>
      {isLoading ? (
        <div className="grid grid-cols-5 gap-[20px]">
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
        <div className=" grid grid-cols-5 gap-[20px]">
          {ad?.map((app: any) => (
            <a
              key={app.id}
              href={app.url}
              target="_blink"
              className=" flex flex-col justify-center items-center gap-[4px]"
            >
              <img
                className=" w-[56px] h-[53px] rounded-[6px] border-[#222]"
                src={app.image}
                alt=""
              />
              <h1 className=" text-white text-[10px] font-[400]">
                {app.title}
              </h1>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default Poppizza;
