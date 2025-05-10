import { paths } from "@/routes/paths";
import backButton from "../../../assets/backButton.svg";
import { Link } from "react-router-dom";
import OtherNoti from "@/components/profile/noti/other-noti";
import { useGetNotiQuery } from "@/store/api/profileApi";
import { dateForamtter } from "@/lib/utils";
import Loader from "@/components/shared/loader";
import Divider from "@/components/shared/divider";
import System from "@/assets/profile/system1.png";
import Balance from "@/assets/profile/balance1.png";
import Creator from "@/assets/profile/Wallet.png";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import BalanceNotiLink from "@/components/profile/noti/balance-noti-link";

const Noti = () => {
  return (
    <div className="w-full h-screen bg-[#16131C] px-5 flex flex-col items-center justify-between no-scrollbar">
      <div className="w-full">
        <div className="flex justify-between items-center py-5 sticky top-0 bg-[#16131C00] z-50">
          <Link to={paths.profile}>
            <img src={backButton} alt="" />
          </Link>
          <p className="text-[16px]">通知</p>
          <div></div>
        </div>
        <div className="space-y-4 pb-10">
          <Link
            to={`/notifications/system`}
            className="flex items-center gap-4"
          >
            <img src={System} className="w-10 h-10 mt-1" alt="" />
            <div className="w-full">
              <div className="flex items-center text-[14px] justify-between">
                <p>系统通知</p>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-[12px] w-[80%] text-[#888]">
                  在此查看您的系统通知
                </p>
                <p className="text-[10px] text-[#888]"></p>
              </div>
            </div>
          </Link>
          <Divider show={true} />
          <Link
            to={`/notifications/balance`}
            className="flex items-center gap-4"
          >
            <img src={Balance} className="w-10 h-10 mt-1" alt="" />
            <div className="w-full">
              <div className="flex items-center text-[14px] justify-between">
                <p>余额提醒</p>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-[12px] w-[80%] text-[#888]">
                  在此查看您的余额提醒
                </p>
                <p className="text-[10px] text-[#888]"></p>
              </div>
            </div>
          </Link>
          <Divider show={true} />
          <Link
            to={`/notifications/creator`}
            className="flex items-center gap-4"
          >
            <img src={Creator} className="w-10 h-10 mt-1" alt="" />
            <div className="w-full">
              <div className="flex items-center text-[14px] justify-between">
                <p>创作者里程碑提醒</p>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-[12px] w-[80%] text-[#888]">
                  在此查看您作为创作者的成就
                </p>
                <p className="text-[10px] text-[#888]"></p>
              </div>
            </div>
          </Link>
          {/* <BalanceNotiLink /> */}
          {/* <SystemNotiLink />
          <BalanceNotiLink />
          <OtherNoti /> */}
        </div>
      </div>
    </div>
  );
};

export default Noti;

// {data?.data?.map((item: any) => {
//   if (item?.type == "creator") {
//     return (
//       <>
//         <OtherNoti item={item} key={item?.id} />
//         <Divider show={true} />
//       </>
//     );
//   } else if (item?.type == "balance_alert") {
//     return (
//       <>
//         <Link
//           to={`/notifications/balance`}
//           state={{
//             data: data?.data?.filter(
//               (item: any) => item?.type == "balance_alert"
//             ),
//             main: "Balance Alert",
//           }}
//           className="flex items-start gap-2"
//         >
//           <img src={Balance} className="w-10 h-10 mt-1" alt="" />
//           <div className="w-full">
//             <div className="flex items-center text-[14px] justify-between">
//               <p>{item?.title}</p>
//               {item?.is_read ? (
//                 <></>
//               ) : (
//                 <div className="w-2 h-2 rounded-full bg-[#FF0004]"></div>
//               )}
//             </div>
//             <div className="flex items-end justify-between">
//               <p className="text-[12px] w-[80%] text-[#888]">
//                 {item?.message}
//               </p>
//               <p className="text-[10px] text-[#888]">
//                 {item?.time_ago}
//               </p>
//             </div>
//           </div>
//         </Link>
//         <Divider show={true} />
//       </>
//     );
//   } else if (item?.type == "system") {
//     return (
//       <>
//         <Link
//           to={`/notifications/system`}
//           state={{ data: item, main: "Beabox Team" }}
//           className="system flex items-start gap-2"
//         >
//           <img src={System} className="w-10 h-10 mt-1" alt="" />
//           <div className="w-full">
//             <div className="flex items-center text-[14px] justify-between">
//               <p>{item.title}</p>
//               {item?.is_read ? (
//                 <></>
//               ) : (
//                 <div className="w-2 h-2 rounded-full bg-[#FF0004]"></div>
//               )}
//             </div>
//             <div className="flex items-end justify-between ">
//               <p className="text-[10px] w-[80%]">{item.message}</p>
//               <p className="text-[10px] text-[#888]">
//                 {item.time_ago}
//               </p>
//             </div>
//           </div>
//         </Link>
//         <Divider show={true} />
//       </>
//     );
//   }
// })}
