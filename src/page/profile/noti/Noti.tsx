import { paths } from "@/routes/paths";
// import { FaAngleLeft } from "react-icons/fa";
import backButton from "../../../assets/backButton.svg";
import { Link } from "react-router-dom";
import OtherNoti from "@/components/profile/noti/other-noti";
import { useGetNotiQuery } from "@/store/api/profileApi";
import { dateForamtter } from "@/lib/utils";
import Loader from "@/components/shared/loader";
import Divider from "@/components/shared/divider";
import System from "@/assets/profile/system1.png";
import Balance from "@/assets/profile/balance1.png";

const Noti = () => {
  const { data, isLoading } = useGetNotiQuery("");
  // console.log(data, "notis");
  if (isLoading) return <Loader />;
  return (
    <div className="w-full h-screen bg-[#16131C] px-5 flex flex-col items-center justify-between no-scrollbar">
      <div className="w-full">
        <div className="flex justify-between items-center py-5 sticky top-0 bg-[#16131C00] z-50">
          <Link to={paths.profile}>
            {/* <FaAngleLeft size={22} /> */}
            <img src={backButton} alt="" />
          </Link>
          <p className="text-[16px]">通知</p>
          <div></div>
        </div>
        <div className="space-y-4 pb-10">
          {data?.data?.map((item: any) => {
            if (item?.type == "general") {
              return (
                <>
                  <OtherNoti item={item} key={item?.id} />
                  <Divider show={true} />
                </>
              );
            } else if (item?.type == "balance_alert") {
              return (
                <>
                  <Link
                    to={`/notifications/${item?.id}`}
                    state={{ data: item, main: "Balance Alert" }}
                    className="flex items-start gap-2"
                  >
                    <img
                      // src={item?.metadata?.image}
                      src={Balance}
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
                  </Link>
                  <Divider show={true} />
                </>
              );
            } else if (item?.type == "system") {
              return (
                <>
                  <Link
                    to={`/notifications/${item?.id}`}
                    state={{ data: item, main: "Beabox Team" }}
                    className="system flex items-start gap-2"
                  >
                    <img
                      // src={item?.metadata?.image}
                      src={System}
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
                  </Link>
                  <Divider show={true} />
                </>
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
