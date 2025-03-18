import React, { useEffect, useState } from "react";
import ggpay from "../../../assets/wallet/ggpay.svg";
import "../wallet.css";
import { useGetMyProfileQuery } from "@/store/api/profileApi";
import { usePostWalletRechargeMutation } from "@/store/api/wallet/walletApi";
import { DrawerClose } from "@/components/ui/drawer";
import { Drawer as DrawerPrimitive } from "vaul";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";
import loader from "../../home/vod_loader.gif";

interface PaymentProps {
  paymentMeth: any;
  total: string;
  selectedCoinId: any;
  setOpen: any;
}

const Payment: React.FC<PaymentProps> = ({
  paymentMeth,
  total,
  selectedCoinId,
  setOpen,
}) => {
  const [imgError, setImgError] = useState(false);
  const [pay, setPay] = useState([]);
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const { data } = useGetMyProfileQuery("");
  const [postWalletRecharge, { isLoading }] = usePostWalletRechargeMutation();
  const DrawerClose = DrawerPrimitive.Close;

  useEffect(() => {
    if (paymentMeth.data) {
      setPay(paymentMeth.data);
      // setSelectedId(paymentMeth.id)
    }
  }, [paymentMeth]);

  const handleSelection = (id: number) => {
    setSelectedId(id);
  };

  const handleSubmit = async () => {
    // console.log(selectedId)
    if (selectedId === 1) {
      return;
    }
    const formData = {
      coin_id: selectedCoinId,
      amount: total,
      payment_method_id: selectedId,
      // reference_id: data?.data.id,
    };
    try {
      const { data } = await postWalletRecharge({ formData });
      if (data?.data) {
        const url = data?.data?.payment_url;
        if (url) {
          window.location.href = url; // Navigate to the new page
        }
      }
      // setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(pay);

  return (
    <>
      {/* <div className="fixed h-screen w-screen z-[9999] inset-0 bg-black/60 flex justify-center items-center">
        <img src={loader} className="w-[100px] h-[100px]" alt="Loading" />
      </div> */}

      <div className="flex flex-col py-[30px] px-[16px] justify-center items-center">
        <div className="flex w-full flex-col justify-center items-center gap-[8px]">
          {pay.map((pp: any) => (
            <div
              key={pp.id}
              onClick={() => handleSelection(pp.id)}
              className={`py-[12px] rounded-[12px] px-[12px] w-full flex justify-between items-center bg-white/5`}
            >
              <div className="flex justify-center items-center gap-[12px]">
                <span>
                  {selectedId === pp.id ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <circle cx="6" cy="6" r="6" fill="#CD3EFF" />
                      <circle cx="6" cy="6" r="3" fill="#1B191B" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <circle
                        cx="6"
                        cy="6"
                        r="6"
                        fill="white"
                        fillOpacity="0.32"
                      />
                    </svg>
                  )}
                </span>
                <h1
                  className={`${
                    selectedId === pp.id ? " text-white" : "text-[#888]"
                  } text-[14px] font-[400]`}
                >
                  {pp.name}
                </h1>
              </div>
              <div>
                <AsyncDecryptedImage
                  className=" h-[20px]"
                  imageUrl={pp.image}
                />
                {/* <img
                onError={() => setImgError(true)}
                // src={imgError ? pp.image : ggpay}
                src={pp.image}
                alt=""
              /> */}
              </div>
            </div>
          ))}
        </div>
        {/* Total */}
        <span className="text-white text-[16px] font-[700] leading-[15px] py-[20px]">
          全部的: <span className="total_pay_text"> $ {total}</span>
        </span>
        {isLoading ? (
          <div className="comfirm_butoon flex justify-center items-center w-full opacity-40">
            <img src={loader} alt="" className="w-12" />
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            className="comfirm_butoon w-full py-[16px] text-white text-[16px] font-[500]"
          >
            确认付款
          </button>
        )}
      </div>
    </>
  );
};

export default Payment;
