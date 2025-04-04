import { useEffect, useState } from "react";
import RankingCard from "../create-center/ranking-card";
import { useSelector } from "react-redux";

const OtherRank = ({ data, refetch }: any) => {
  // const [list, setList] = useState([]);
  const user = useSelector((state: any) => state?.persist?.user);
  const list = data?.slice(3);

  // useEffect(() => {
  //   if (data?.length) setList(data?.filter((_: any, index: any) => index >= 3));
  // }, [data]);

  return (
    <>
      {list?.map((item: any) => (
        <div className="flex items-center gap-3" key={item?.id}>
          <p className="text-[16px] font-semibold w-8">{item?.rank}</p>
          <RankingCard data={item} refetch={refetch} />
        </div>
      ))}
    </>
  );
};

export default OtherRank;
