import React, { useEffect, useRef, useState } from "react";
import "../wallet.css";
import transit from "../../../assets/wallet/transit.png";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import Payment from "./Payment";

interface RechDetailsProps {
  coin: any;
  paymentMeth: any;
}

const RechDetails: React.FC<RechDetailsProps> = ({ coin, paymentMeth }) => {
  const [open, setOpen] = useState(false);

  const [total, setTotal] = useState("");
  const [selectedId, setSelectedId] = useState<any>();
  // const lastRoom = coin[coin.length - 1];
  const lastRoom = coin?.length > 0 ? coin[coin.length - 1] : [];
  const drawerRef = useRef<any>();
  // console.log(coin);
  const showBox = (cc: any) => {
    setTotal(cc.amount);
    setSelectedId(cc.id);
    setOpen(true);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);
  // console.log(selectedId)
  return (
    <div>
      {/* head */}
      <div className="pb-[20px]">
        <h1 className="text-white text-[16px] font-[500] leading-[15px]">
          充值
        </h1>
        <span className="text-[#999] font-[300] text-[14px] leading-[20px]">
          立即充值，限时获得 <span className="bonus_text">10% {""}</span>
          奖励。
        </span>
      </div>
      {/* coins */}
      <div className="grid grid-cols-3 gap-[8px]">
        <Drawer open={open} onOpenChange={setOpen}>
          {coin
            // ?.slice()
            // .reverse()
            .map((cc: any) => (
              <DrawerTrigger key={cc.id}>
                <div
                  onClick={() => showBox(cc)}
                  className={` ${
                    selectedId === cc.id ? "popular_box" : "coin_list_box"
                  } flex flex-col justify-center items-center relative overflow-hidden`}
                >
                  <div className="flex flex-col justify-center items-center pt-[20px]">
                    <img className=" w-[24px] h-[24px]" src={transit} alt="" />
                    <div className=" py-[12px] flex flex-col justify-center items-center gap-[]">
                      <h1 className=" text-white text-[14px] font-[500] leading-[20px]">
                        {cc.coin} Coins
                      </h1>
                      {cc.bonus_coin && (
                        <span className=" text-[10px] font-[700] leading-[14px] coin_bonus_text">
                          +{cc.bonus_coin} Coins Bonus
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className={`${
                      selectedId === cc.id
                        ? " bg-gradient-to-bl from-[#CD3EFF] to-[#FFB2E0]"
                        : "bg-[#312648]"
                    }  w-full flex justify-center items-center`}
                  >
                    <span className=" py-[8px] text-white text-[14px] font-[700] leading-[16px]">
                      ${cc.amount}
                    </span>
                  </div>
                  {cc.bonus_percentage && (
                    <div className=" absolute top-0 right-0 badge_bouns_pop flex justify-center items-center p-[4px]">
                      <span className=" text-white text-[6px] font-[700] leading-[8px]">
                        {/* {lastRoom.id === cc.id ? "Popular" : "10% Bonus"} */}
                        {cc.bonus_percentage}% Bonus
                      </span>
                    </div>
                  )}
                </div>
              </DrawerTrigger>
            ))}
          <div className="flex justify-between items-center">
            <DrawerContent className=" border-none">
              <Payment
                total={total}
                selectedCoinId={selectedId}
                paymentMeth={paymentMeth}
                setOpen={setOpen}
              />
            </DrawerContent>
          </div>
        </Drawer>
      </div>
      {/* remainder */}
      <div className=" py-[30px]">
        <h1 className=" text-[#ff] pb-[8px] text-[16px] fon-[400] leading-[15px]">
          付款提醒
        </h1>
        <div className=" flex flex-col gap-[16px] text-[#888] text-[14px] font-[300]">
          <p>1. 跳转后请及时付款。逾期付款将不会记入您的帐户，您需要重新付款</p>
          <p>
            2.
            每天发起付款次数不得超过5次。如果连续发起付款但未付款，则该往来账户将被列入黑名单。
          </p>
          <p>3. 夜间支付渠道繁忙。为保证您的体验，请选择白天支付</p>
          <p>4. 若所选支付方式无法支付，请尝试其他支付方式。</p>
        </div>
      </div>
    </div>
  );
};

export default RechDetails;
