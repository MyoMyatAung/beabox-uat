import { useGetMyOwnProfileQuery } from "@/store/api/createCenterApi";
import { useNavigate } from "react-router-dom";
import { paths } from "@/routes/paths";
import dollar from "@/assets/createcenter/dollar.png";

const WalletDetails = () => {
  const { data } = useGetMyOwnProfileQuery("");
  console.log(data);
  const navigate = useNavigate();
  return (
    <section className="bg-[#24222C] w-full min-h-[246px] flex justify-between items-center flex-col rounded-[20px] p-3">
      <div className=" flex flex-col items-center justify-center mt-4">
        <p className="text-[18px]">
          {data?.data?.likes_sum_count ? data?.data?.likes_sum_count : 0}
        </p>
        <p className="text-[12px] text-[#888888]">帖子点赞</p>
      </div>
      <div className="bg-[#FFFFFF1F] w-[60px] h-[1px]"></div>
      <div className=" flex flex-col items-center justify-center">
        <p className="text-[18px] flex gap-1 items-center">
          {data?.data?.wallet_balance ? data?.data?.wallet_balance : 0}{" "}
          <img src={dollar} className="w-[13px] h-[13px]" alt="" />
        </p>
        <p className="text-[12px] text-[#888888]">你的收益</p>
      </div>

      <button
        onClick={() => navigate(paths.wallet)}
        className="text-[14px] rounded-[12px] bg-[#FFFFFF1F] text-center w-full py-2"
      >
        在钱包中查看
      </button>
    </section>
  );
};

export default WalletDetails;
