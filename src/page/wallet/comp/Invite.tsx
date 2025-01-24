import React, { useRef, useState } from "react";
import Header from "../Header";
import { useGetInviteQuery } from "@/store/api/wallet/walletApi";
import qr from "../../../assets/wallet/qr.svg";
import "../wallet.css";
import { Link } from "lucide-react";
import { useGetMyProfileQuery } from "@/store/api/profileApi";
import { toPng } from "html-to-image";
import shareLogo from '../../../assets/share-logo.svg'
interface InviteProps {}

const Invite: React.FC<InviteProps> = ({}) => {
  const { data } = useGetInviteQuery("");
  const { data: ppdaata } = useGetMyProfileQuery("");
  const [copied, setCopied] = useState<boolean>(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleCopyCode = () => {
    if (ppdaata?.data) {
      const inviteCode = ppdaata.data.user_code;
      navigator.clipboard.writeText(inviteCode).then(() => {
        setCopied(true); // Set copied to true immediately
        setTimeout(() => {
          setCopied(false); // Reset copied to false after 2 seconds
        }, 2000);
      });
    }
  };

  const handleSaveAsImage = () => {
    if (imageRef.current) {
      toPng(imageRef.current, { cacheBust: true })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "share-info.png";
          link.click();
        })
        .catch((err) => {
          console.error("Failed to generate image:", err);
        });
    }
  };

  return (
    <div className=" flex justify-center items-center">
      <div className="w-screen xl:w-[800px]">
        <Header lv={false} title="我要分享" />
        {copied && (
          <div className="absolute flex justify-center items-cente w-full h-ful ">
            <p className="text-[#fff] text-[12px] font-[400] leading-[14px] text-center px-[20px] py-[12px] copy_btn">
            已复制
            </p>
          </div>
        )}
        <div className=" px-[30px] flex flex-col gap-[100px] justify-between">
          {/* qr */}
          {ppdaata && data ? (
            <div
              ref={imageRef}
              className=" mt-[60px] p-10 rounded-lg flex flex-col gap-[30px] justify-center items-center img-bg"
            >
              <img src={shareLogo} className="h-[40px]"/>
              <img className=" w-[180px] h-[180px]" src={qr} alt="" />
              <p className=" text-[#888] text-[12px] font-[400] leading-[14px] text-center">
              分享此邀请码邀请您的朋友下载app，即可领取 Bebit 币！
              </p>
              <button
                onClick={handleCopyCode}
                className=" flex justify-center items-center gap-[6px] px-[20px] py-[12px] copy_btn"
              >
                <Link className=" w-[14px] h-[14px]" />
                <span className=" text-white text-[12px] font-[400] leading-[20px]">
                  {ppdaata?.data.user_code}
                </span>
              </button>
            </div>
          ) : (
            <div className=" pt-[100px] flex justify-center items-center">
              <div className="scan py-6 px-10 flex flex-col justify-center items-center gap-[16px]">
                <div className=" animate-pulse bg-white/30 w-[180px] h-[180px] rounded-[10px]"></div>
                <div className="">
                  <div className="bg-white/30 rounded-[16px] animate-pulse w-[200px] h-[30px] flex gap-[8px]  px-[16px] py-[8px]"></div>
                </div>
              </div>
            </div>
          )}

          {/* two buttons */}
          <div className=" flex justify-center items-center gap-[24px]">
            <button className="px-[20px] py-[12px] copy_btn text-white text-[12px] font-[400] leading-[20px]">
              保存邀请码
            </button>
            <button
              onClick={handleSaveAsImage}
              className="px-[20px] py-[12px] copy_btn text-white text-[12px] font-[400] leading-[20px]"
            >
              复制邀请链接
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invite;
