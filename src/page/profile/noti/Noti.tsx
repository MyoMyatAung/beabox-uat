import { paths } from "@/routes/paths";
import { FaAngleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import SystemNotiLink from "@/components/profile/noti/system-noti-link";
import BalanceNotiLink from "@/components/profile/noti/balance-noti-link";
import OtherNoti from "@/components/profile/noti/other-noti";
import { useGetNotiQuery } from "@/store/api/profileApi";
import { dateForamtter } from "@/lib/utils";

const Noti = () => {
  const { data } = useGetNotiQuery("");
  console.log(data, "notis");
  return (
    <div className="w-full h-screen px-5 flex flex-col items-center justify-between no-scrollbar">
      <div className="w-full">
        <div className="flex justify-between items-center py-5 sticky top-0 bg-black z-50">
          <Link to={paths.profile}>
            <FaAngleLeft size={18} />
          </Link>
          <p className="text-[16px]">Notifications</p>
          <div></div>
        </div>
        <div className="space-y-5 pb-10">
          {data?.data?.map((item: any) => {
            if (item?.type == "general") {
              return <OtherNoti item={item} key={item?.id} />;
            } else if (item?.type == "balance_alert") {
              return (
                <div className="flex items-start gap-2">
                  <img
                    src={item?.metadata?.image}
                    className="w-10 h-10 mt-1"
                    alt=""
                  />
                  <div className="w-full">
                    <div className="flex items-center text-[14px] justify-between">
                      <p>{item?.title}</p>
                      {/* <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div> */}
                    </div>
                    <div className="flex items-end justify-between">
                      <p className="text-[10px] w-[80%] text-[#888]">
                        {item?.message}
                      </p>
                      <p className="text-[10px] text-[#888]">
                        {dateForamtter(item?.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            } else if (item?.type == "system") {
              return (
                <div className="system flex items-start gap-2">
                  <img
                    src={item?.metadata?.image}
                    className="w-10 h-10 mt-1"
                    alt=""
                  />
                  <div className="w-full">
                    <div className="flex items-center text-[14px] justify-between">
                      <p>{item.title}</p>
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    </div>
                    <div className="flex items-end justify-between ">
                      <p className="text-[10px] w-[80%]">{item.message}</p>
                      <p className="text-[10px] text-[#888]">
                        {dateForamtter(item.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
          })}
          {/* <SystemNotiLink />
          <BalanceNotiLink />
          <OtherNoti /> */}
        </div>
      </div>
    </div>
  );
};

export default Noti;
