const OtherStats = ({ followers, following, likecount }: any) => {
  console.log(followers, following, "fws");
  return (
    // <Drawer
    //   open={isDrawerOpen}
    //   onOpenChange={() => dispatch(setIsDrawerOpen(true))}
    // >
    <div className="flex z-[1200] justify-between w-full max-w-xs my-4 items-center mx-auto">
      <div className="text-center">
        {/* <DrawerTrigger
            asChild
            onClick={() => dispatch(setDefaultFollowTab("follower"))}
          > */}
        <div>
          <div className="text-[14px] font-semibold">
            {followers ? followers : 0}
          </div>
          <div className="text-gray-400 text-[14px]">粉丝</div>
        </div>
        {/* </DrawerTrigger> */}
      </div>
      <span className="text-gray-500">|</span>
      <div className="text-center">
        {/* <DrawerTrigger
            asChild
            onClick={() => dispatch(setDefaultFollowTab("following"))}
          > */}
        <div>
          <div className="text-[14px] font-semibold">
            {following ? following : 0}
          </div>
          <div className="text-gray-400 text-[14px]">已关注</div>
        </div>
        {/* </DrawerTrigger> */}
      </div>
      <span className="text-gray-500">|</span>
      <div className="text-center">
        <div className="text-[14px] font-semibold">{likecount}</div>
        <div className="text-gray-400 text-[14px]">点赞</div>
      </div>
    </div>
  );
};

export default OtherStats;
