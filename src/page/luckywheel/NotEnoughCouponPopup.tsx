import React from "react";
import "./NotEnoughCouponPopup.css"; // We'll create this CSS file next

interface NotEnoughCouponPopupProps {
  onCancel: () => void;
  onInviteFriend: () => void;
}

const NotEnoughCouponPopup: React.FC<NotEnoughCouponPopupProps> = ({
  onCancel,
  onInviteFriend,
}) => {
  return (
    <div className="popup-overlay">
      <div className="popup1">
        <div className="frame-1321315641">
          <div className="frame-1321315642">
            <div className="not-enough-coupon-invite-friends-to-win-lucky-draw-coupons">
              抽奖劵不足，邀请好友可获得抽奖劵
            </div>
          </div>
        </div>
        <div className="frame-630980">
          <div className="frame-193520" onClick={onCancel}>
            <div className="cancel">取消</div>
          </div>
          <div className="frame-193518" onClick={onInviteFriend}>
            <div className="invite-friend">邀请好友</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotEnoughCouponPopup;
