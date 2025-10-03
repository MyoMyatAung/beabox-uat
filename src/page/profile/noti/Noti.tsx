import { paths } from "@/routes/paths";
import backButton from "../../../assets/backButton.svg";
import { Link } from "react-router-dom";
import Divider from "@/components/shared/divider";
import System from "@/assets/profile/system1.png";
import Balance from "@/assets/profile/balance1.png";
import Creator from "@/assets/profile/Wallet.png";
import NotiTypeItem from "../component/NotiTypeItem";
import { NOTIFICATION_CONFIG } from "@/constants/noti-constant";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Noti = () => {
  const notiData = JSON.parse(
    localStorage.getItem(NOTIFICATION_CONFIG.STORAGE_KEY) || "{}"
  );
  const user = useSelector((state: any) => state.persist.user);

  useEffect(() => {
    console.log("SET NOTI DATA");
    if (!user?.token) {
      localStorage.setItem(
        NOTIFICATION_CONFIG.STORAGE_KEY,
        JSON.stringify({ ...notiData, isReadForUnauthenticated: true })
      );
    }
  }, [notiData, user?.token]);
  return (
    <div className="w-full h-screen bg-[#16131C] px-5 flex flex-col items-center justify-between no-scrollbar">
      <div className="w-full">
        <div className="flex justify-between items-center py-5 sticky top-0 bg-[#16131C00] z-50">
          <Link to={paths.profile}>
            <img src={backButton} alt="" />
          </Link>
          <p className="text-[18px] font-bold">通知</p>
          <div className="px-3"></div>
        </div>
        <div className="space-y-4 pb-10">
          <NotiTypeItem
            title="系统通知"
            message="在此查看您的系统通知"
            src={System}
            type="system"
            path="system"
          />
          <Divider show={true} />
          <NotiTypeItem
            title="余额提醒"
            message="在此查看您的余额提醒"
            src={Balance}
            type="balance_alert"
            path="balance"
          />
          <Divider show={true} />
          <NotiTypeItem
            title="创作者里程碑提醒"
            message="在此查看您作为创作者的成就"
            src={Creator}
            type="creator"
            path="creator"
          />
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
//             <div className="flex items-center text-[14px] justify-between font-bold">
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
//             <div className="flex items-center text-[14px] justify-between font-bold">
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
