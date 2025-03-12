import { useGetMyOwnProfileQuery } from "@/store/api/createCenterApi";
import Divider from "./divider";
import { useNavigate } from "react-router-dom";
import { paths } from "@/routes/paths";

const WalletDetails = () => {
  const { data } = useGetMyOwnProfileQuery("");
  console.log(data);
  const navigate = useNavigate();
  return (
    <section className="bg-[#24222C] p-5 rounded-[20px] mx-5 my-5">
      <div className="flex justify-around items-center">
        <div className=" flex flex-col items-center justify-center">
          <p className="text-[18px]">
            {data?.data?.likes_sum_count ? data?.data?.likes_sum_count : 0}
          </p>
          <p className="text-[12px] text-[#888888]">Post Likes</p>
        </div>
        <Divider />
        <div className=" flex flex-col items-center justify-center">
          <p className="text-[18px]">
            {data?.data?.wallet_balance ? data?.data?.wallet_balance : 0} $
          </p>
          <p className="text-[12px] text-[#888888]">Your Earning</p>
        </div>
      </div>
      <button
        onClick={() => navigate(paths.wallet)}
        className="text-[14px] rounded-[12px] bg-[#FFFFFF1F] text-center w-full py-3 mt-5"
      >
        View Details In Wallet
      </button>
    </section>
  );
};

export default WalletDetails;
