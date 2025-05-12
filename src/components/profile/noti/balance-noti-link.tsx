import Balance from "@/assets/profile/balance1.png";
import { paths } from "@/routes/paths";
import { useNavigate } from "react-router-dom";

const BalanceNotiLink = () => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(paths.balance_noti)}
      className="flex items-start gap-2"
    >
      <img src={Balance} className="w-10 h-10 mt-1" alt="" />
      <div className="w-full">
        <div className="flex items-center text-[14px] justify-between font-bold">
          <p>Balance Alert</p>
          {/* <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div> */}
        </div>
        <div className="flex items-end justify-between">
          <p className="text-[12px] w-[80%] text-[#888]">
            Withdraw Notice : You’ve successfully added 20 coins to your wallet.
            A chan...
          </p>
          <p className="text-[10px] text-[#888]">1 day</p>
        </div>
      </div>
    </div>
  );
};

export default BalanceNotiLink;
