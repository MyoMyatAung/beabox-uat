import React from "react";

const Rule = () => {
  return (
    <div className="w-full max-w-md p-3 text-xs backdrop-blur-[32px] leading-[20px] font-sf mx-auto">
      <div className="bg-[#f14884] px-5 mx-2 py-2">
        <h3 className="text-center text-sm font-bold mb-2">邀请规则</h3>
        <ol className="list-decimal list-inside space-y-2 text-white text-opacity-90">
            <li>与分享的好友首次登录并注册即算邀请成功。</li>
            <li>如果用户异常注册，奖励可能会被取消。</li>
            <li>收益按照系统实时统计数据为准。</li>
            <li>为确保奖励发放，请正确填写用户信息。</li>
            <li>活动最终解释权归平台所有。</li>
        </ol>
      </div>
      <div className="text-center mt-4">
        <p className="">活动规则的最终解释权归 笔盒 应用所有</p>

      </div>

    </div>
  );
};

export default Rule;
