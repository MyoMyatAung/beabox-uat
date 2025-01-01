import React, { useState } from "react";
import "../wallet.css";
import transit from "../../../assets/wallet/transit.png";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import Payment from "./Payment";

interface RechDetailsProps {
  coin: any;
  paymentMeth: any;
}

const RechDetails: React.FC<RechDetailsProps> = ({ coin, paymentMeth }) => {
  const [total, setTotal] = useState("");
  // const lastRoom = coin[coin.length - 1];
  const lastRoom = coin?.length > 0 ? coin[0] : [];

  return (
    <div>
      <Drawer>
        {/* head */}
        <div className="pb-[20px]">
          <h1 className="text-white text-[16px] font-[500] leading-[15px]">
            Recharge
          </h1>
          <span className="text-[#999] font-[300] text-[14px] leading-[20px]">
            Recharge now and get{" "}
            <span className="bonus_text">10% bonus{""}</span>
            for a limited time.
          </span>
        </div>
        {/* coins */}
        <div className="grid grid-cols-3 gap-[8px]">
          {coin
            ?.slice()
            .reverse()
            .map((cc: any) => (
              <DrawerTrigger key={cc.id}>
                <div
                  onClick={() => setTotal(cc.amount)}
                  className={` ${
                    lastRoom.id === cc.id ? "popular_box" : "coin_list_box"
                  } flex flex-col justify-center items-center relative overflow-hidden`}
                >
                  <div className="flex flex-col justify-center items-center pt-[20px]">
                    <img className=" w-[24px] h-[24px]" src={transit} alt="" />
                    <div className=" py-[12px] flex flex-col justify-center items-center gap-[]">
                      <h1 className=" text-white text-[14px] font-[500] leading-[20px]">
                        {cc.coin} Coins
                      </h1>
                      <span className=" text-[10px] font-[700] leading-[14px] coin_bonus_text">
                        +{cc.bonus_coin} Coins Bonus
                      </span>
                    </div>
                  </div>
                  <div
                    className={`${
                      lastRoom.id === cc.id
                        ? " bg-gradient-to-bl from-[#CD3EFF] to-[#FFB2E0]"
                        : "bg-[#282828]"
                    }  w-full flex justify-center items-center`}
                  >
                    <span className=" py-[8px] text-white text-[14px] font-[700] leading-[16px]">
                      ${cc.amount}
                    </span>
                  </div>
                  <div className=" absolute top-0 right-0 badge_bouns_pop flex justify-center items-center p-[4px]">
                    <span
                      className={`${
                        lastRoom.id === cc.id ? "block pr-[2px]" : "hidden"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="8"
                        height="10"
                        viewBox="0 0 8 10"
                        fill="none"
                      >
                        <path
                          d="M6.57001 4.25197C6.45075 4.09641 6.30556 3.96159 6.17074 3.82678C5.82332 3.51566 5.42924 3.29269 5.09738 2.96601C4.32476 2.20895 4.15365 0.959287 4.64625 0C4.15365 0.119263 3.72326 0.3889 3.3551 0.684464C2.0121 1.76301 1.4832 3.66603 2.11581 5.29941C2.13655 5.35126 2.15729 5.40312 2.15729 5.47053C2.15729 5.5846 2.07951 5.68831 1.97581 5.72979C1.85654 5.78165 1.7321 5.75053 1.63357 5.66757C1.60414 5.64292 1.57953 5.61303 1.56098 5.57942C0.975036 4.83792 0.8817 3.77492 1.27579 2.92453C0.409835 3.62973 -0.0620304 4.82236 0.00537896 5.94758C0.036491 6.20684 0.0676029 6.46611 0.155754 6.72538C0.228348 7.0365 0.368352 7.34762 0.523912 7.62244C1.08393 8.5195 2.05359 9.16248 3.09584 9.29212C4.2055 9.43212 5.39294 9.22989 6.24334 8.46246C7.19225 7.6017 7.52411 6.2224 7.03669 5.04014L6.96928 4.90532C6.86039 4.6668 6.57001 4.25197 6.57001 4.25197ZM4.93145 7.51873C4.78626 7.64318 4.54773 7.778 4.36106 7.82985C3.7803 8.03727 3.19954 7.74689 2.85731 7.40466C3.47437 7.25947 3.84253 6.80316 3.95142 6.34166C4.03957 5.92684 3.87364 5.5846 3.80623 5.18533C3.744 4.80162 3.75437 4.47494 3.89438 4.11715C3.9929 4.3142 4.09661 4.51124 4.22106 4.6668C4.62033 5.18533 5.24775 5.41349 5.38257 6.11869C5.40331 6.19129 5.41368 6.26388 5.41368 6.34166C5.42924 6.76686 5.24257 7.23354 4.93145 7.51873Z"
                          fill="white"
                        />
                      </svg>
                    </span>
                    <span className=" text-white text-[6px] font-[700] leading-[8px]">
                      {lastRoom.id === cc.id ? "Popular" : "10% Bonus"}
                    </span>
                  </div>
                </div>
              </DrawerTrigger>
            ))}
        </div>
        {/* remainder */}
        <div className=" py-[30px]">
          <h1 className=" text-[#ff] pb-[8px] text-[16px] fon-[400] leading-[15px]">
            Payment Reminder
          </h1>
          <div className=" flex flex-col gap-[16px] text-[#888] text-[12px] font-[300]">
            <p>
              1. Please pay in time after the jump. Overdue payment will not be
              credited to your account and you need to re-send the payment.
            </p>
            <p>
              2. Payments cannot be initiated more than 5 times a day. If
              payments are initiated continuously but not paid, the current
              account will be added to the blacklist.
            </p>
            <p>
              3. Payment channels are busier at night. To ensure your
              experience, please choose to pay during the day.
            </p>
            <p>
              4. If the selected payment method fails to pay, please try a
              different payment method.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <DrawerContent className=" border-none">
            <Payment total={total} paymentMeth={paymentMeth} />
          </DrawerContent>
        </div>
      </Drawer>
    </div>
  );
};

export default RechDetails;
