import React, { useEffect, useState } from "react";
import ggpay from "../../../assets/wallet/ggpay.svg";
import "../wallet.css";

interface PaymentProps {
  paymentMeth: any;
  total: string;
}

const Payment: React.FC<PaymentProps> = ({ paymentMeth, total }) => {
  const [imgError, setImgError] = useState(false);
  const [pay, setPay] = useState([]);
  const [selectedId, setSelectedId] = useState<number | null>(1);

  useEffect(() => {
    if (paymentMeth.data) {
      setPay(paymentMeth.data);
    }
  }, [paymentMeth]);

  const handleSelection = (id: number) => {
    setSelectedId(id);
  };

  return (
    <div className="flex flex-col py-[30px] px-[16px] justify-center items-center">
      <div className="flex w-full flex-col justify-center items-center gap-[8px]">
        {pay.map((pp: any) => (
          <div
            key={pp.id}
            onClick={() => handleSelection(pp.id)}
            className={`py-[12px] rounded-[12px] px-[12px] w-full flex justify-between items-center bg-white/10`}
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
              <h1 className={`${selectedId === pp.id ? " text-white" : "text-[#888]"} text-[14px] font-[400]`}>{pp.name}</h1>
            </div>
            <div>
              <img
                onError={() => setImgError(true)}
                src={imgError ? pp.image : ggpay}
                alt=""
              />
            </div>
          </div>
        ))}
      </div>
      {/* Total */}
      <span className="text-white text-[16px] font-[700] leading-[15px] py-[20px]">
        Total: <span className="total_pay_text"> $ {total}</span>
      </span>
      <button className="comfirm_butoon w-full py-[16px] text-white text-[16px] font-[500]">
        Confirm Payment
      </button>
    </div>
  );
};

export default Payment;
