import { paths } from "@/routes/paths";
import backButton from "../../../assets/backButton.svg";
import { Link } from "react-router-dom";
import Card from "@/components/profile/noti/card";
import systembell from "@/assets/profile/systembell.png";
import { useGetNotiQuery } from "@/store/api/profileApi";
import Loader from "@/components/shared/loader";
import { useSelector } from "react-redux";
import { useEffect } from "react";
const formatdate = (data: any) => {
  const date = new Date(data);
  const formattedDate = date
    .toLocaleString("en-GB", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    })
    .replace(/\//g, "-");
  return formattedDate;
};

const SystemNoti = () => {
  const { data, isLoading, refetch } = useGetNotiQuery("system");

  const uniqueDates = [
    ...new Set(data?.data?.map((item: any) => item?.created_at)),
  ];

  const groupedData = uniqueDates.map((date) => ({
    date,
    list: data?.data
      ?.filter((item: any) => item?.created_at === date)
      ?.map((item: any) => item),
  }));

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const today = getTodayDate();

  const user = useSelector((state: any) => state.persist.user);
  useEffect(() => {
    if (user) refetch();
  }, [user, refetch]);

  if (isLoading) return <Loader />;

  return (
    <div className="w-full h-screen px-5 flex flex-col items-center justify-between no-scrollbar">
      <div className="w-full">
        <div className="flex justify-between items-center py-5 sticky top-0 bg-[#16131C] z-50">
          <Link to={paths.noti}>
            <img src={backButton} alt="" />
          </Link>
          <p className="text-[16px] font-bold">系统通知</p>
          <div className="px-2"></div>
        </div>
        <div className="space-y-5 pb-10">
          {groupedData?.length ? (
            groupedData?.map((item: any) => (
              <div>
                <p className="text-[12px] text-[#666666] text-center my-2">
                  {/* {formatdate(item?.date)} */}
                  {item?.date === today ? <></> : formatdate(item?.date)}
                </p>
                <div className="space-y-5">
                  {item?.list?.map((item: any) => (
                    <Card item={item} type="system" />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="w-full flex flex-col justify-center items-center h-[80vh]">
              <img src={systembell} className="w-10" alt="" />
              <p className="text-[14px] mt-2">目前没有新的通知</p>
            </div>
          )}
          {/* {state?.state?.data?.length ? (
            state?.state?.data?.map((item: any) => (
              <Card item={item} type="system" />
            ))
          ) : (
            <div className="w-full flex flex-col justify-center items-center h-[80vh]">
              <img src={systembell} className="w-10" alt="" />
              <p className="text-[14px] mt-2">目前没有新的通知</p>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default SystemNoti;
