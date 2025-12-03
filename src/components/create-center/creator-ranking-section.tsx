import { Link, useNavigate } from "react-router-dom";
import { paths } from "@/routes/paths";
import rankingBg from "@/assets/createcenter/ranking_bg.svg";
import AvatarImage from "@/components/avatar/avatar-image";
import { FaCrown } from "react-icons/fa6";
import { BsPersonFill } from "react-icons/bs";
import { Check, ChevronRight } from "lucide-react";

interface CreatorRankingSectionProps {
  data: any;
  handleFollow: (userId: string, isFollowed: boolean) => void;
  user: any;
  followStatus: any;
}

interface RankCardProps {
  rank: number;
  rankData: any;
  isFollowed: boolean;
  user: any;
  handleFollow: (userId: string, isFollowed: boolean) => void;
  variant?: "default" | "large";
}

export const RankCard = ({
  rank,
  rankData,
  isFollowed,
  user,
  handleFollow,
  variant = "default",
}: RankCardProps) => {
  const getCrownColor = () => {
    if (rank === 1) return "text-[#F7E29B]";
    if (rank === 2) return "text-[#D7D7D8]";
    return "text-[#FF9C7B]";
  };

  const getRankClass = () => {
    if (rank === 1) return "rank1";
    if (rank === 2) return "rank2";
    return "rank3";
  };

  const sizeConfig =
    variant === "large"
      ? {
          cardWidthClass: "w-full",
          minWidth: undefined,
          overlayRadius: "rounded-[8px]",
          cardRadius: "rounded-[8px]",
          rankLabelClass: "top-3 left-3 text-[18px]",
          spacingClass: "pt-8",
          avatarWrapperClass: "w-11 h-10",
          placeholderWrapperClass: "w-10 h-10",
          crownSize: 18,
          crownOffsetClass: "-top-3 -rotate-45 -left-2",
          nameTextClass: "text-sm mb-2",
          followerTextClass: "text-xs mb-3",
          buttonClass:
            "text-[14px] font-medium z-[1000] flex items-center justify-center gap-1 rounded-[8px] py-1.5 px-4",
          buttonDisabledClass:
            "text-[14px] font-medium flex items-center justify-center gap-1 rounded-[8px] py-1.5 px-4 bg-[#2B2830] w-full whitespace-nowrap opacity-40",
          iconSize: 36,
        }
      : {
          cardWidthClass: "w-[100px]",
          minWidth: 80,
          overlayRadius: "rounded-[6px]",
          cardRadius: "rounded-[6px]",
          rankLabelClass: "top-1 left-1 text-[10.5px]",
          spacingClass: "pt-4",
          avatarWrapperClass: "w-8 h-7",
          placeholderWrapperClass: "w-7 h-7",
          crownSize: 12,
          crownOffsetClass: "-top-1.5 -rotate-45 -left-1.5",
          nameTextClass: "text-[9.5px] mb-1",
          followerTextClass: "text-[9px] mb-2",
          buttonClass:
            "text-[10px] font-medium z-[1000] flex items-center justify-center gap-0.5 rounded-[6px] py-1",
          buttonDisabledClass:
            "text-[10px] font-medium flex items-center justify-center gap-0.5 rounded-[6px] py-1 bg-[#2B2830] w-full whitespace-nowrap opacity-40",
          iconSize: 20,
        };

  const buttonClasses = (active: boolean) =>
    `${sizeConfig.buttonClass} ${
      active ? "bg-[#2B2830]" : "gradient-bg"
    } w-full whitespace-nowrap`;

  if (!rankData) {
    return (
      <div
        className={`${getRankClass()} flex flex-col items-center z-50 relative ${
          sizeConfig.cardWidthClass
        } ${sizeConfig.cardRadius} overflow-hidden`}
        style={{ minWidth: sizeConfig.minWidth }}
      >
        <div
          className={`bg-gradient-to-b from-[#00000000] to-[#000000cc] absolute top-0 left-0 w-full h-full ${sizeConfig.overlayRadius}`}
        ></div>
        <p
          className={`absolute text-[#fff] font-semibold z-10 ${sizeConfig.rankLabelClass}`}
        >
          {rank}
        </p>
        <div
          className={`flex flex-col items-center z-10 w-full ${sizeConfig.spacingClass}`}
        >
          <div
            className={`bg-[#FFFFFF1A] ${sizeConfig.placeholderWrapperClass} rounded-full mb-2 animate-pulse`}
          ></div>
          <p className="text-[9.5px] z-10 text-white/40 mb-1">敬请期待</p>
          <p className="text-[#AAA] text-[9px] z-10 leading-tight mb-2">--</p>
          <div className="w-full z-10 mt-auto">
            <button disabled className={sizeConfig.buttonDisabledClass}>
              关注
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${getRankClass()} flex flex-col items-center z-50 relative ${
        sizeConfig.cardWidthClass
      } ${sizeConfig.cardRadius} overflow-hidden`}
      style={{ minWidth: sizeConfig.minWidth }}
    >
      <div
        className={`bg-gradient-to-b from-[#00000000] to-[#000000cc] absolute top-0 left-0 w-full h-full ${sizeConfig.overlayRadius}`}
      ></div>
      <p
        className={`absolute text-[#fff] font-semibold z-10 ${sizeConfig.rankLabelClass}`}
      >
        {rank}
      </p>
      <div
        className={`flex flex-col items-center z-10 w-full ${sizeConfig.spacingClass}`}
      >
        {rankData?.photo ? (
          <Link to={paths.getUserProfileId(rankData?.id)}>
            <div className={`${sizeConfig.avatarWrapperClass} relative mb-2`}>
              <AvatarImage
                src={rankData?.photo}
                width={""}
                height={""}
                className={`${sizeConfig.avatarWrapperClass} rounded-full object-cover`}
                alt=""
              />
              <FaCrown
                size={sizeConfig.crownSize}
                className={`${getCrownColor()} absolute ${
                  sizeConfig.crownOffsetClass
                }`}
              />
            </div>
          </Link>
        ) : (
          <div
            className={`bg-[#FFFFFF52] ${sizeConfig.placeholderWrapperClass} rounded-full flex justify-center items-center border relative mb-2`}
          >
            <BsPersonFill size={sizeConfig.iconSize} />
            <FaCrown
              size={sizeConfig.crownSize}
              className={`${getCrownColor()} absolute ${
                sizeConfig.crownOffsetClass
              }`}
            />
          </div>
        )}
        <p
          className={`${sizeConfig.nameTextClass} z-10 truncate w-full text-center leading-tight font-semibold`}
        >
          {rankData?.nickname || "未知"}
        </p>
        <p
          className={`${sizeConfig.followerTextClass} text-[#AAA] z-10 leading-tight`}
        >
          {rankData?.total_followers}
        </p>
        <div className="w-full z-10 mt-auto">
          {rankData?.id === user?.id ? (
            <div className="opacity-0">
              <button className={sizeConfig.buttonDisabledClass}>
                已关注 <Check size={12} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleFollow(rankData?.id, isFollowed)}
              className={buttonClasses(isFollowed)}
            >
              {isFollowed ? "已关注" : "关注"}{" "}
              {isFollowed && <Check size={12} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const CreatorRankingSection = ({
  data,
  handleFollow,
  user,
  followStatus,
}: CreatorRankingSectionProps) => {
  const navigate = useNavigate();

  return (
    <div className="px-5">
      <div
        className="relative w-full overflow-hidden"
        style={{
          backgroundImage: `url(${rankingBg})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          aspectRatio: "361 / 221",
        }}
      >
        <div className="flex flex-col justify-between h-full p-4">
          <div className="flex items-start justify-end">
            <button
              onClick={() => navigate(`${paths.ranking}?tab=author`)}
              className="text-sm text-white/80 flex items-center"
            >
              <p>查看更多</p>
              <ChevronRight className="size-4" />
            </button>
          </div>
          <div>
            <div className="flex items-center justify-center">
              <div className="flex justify-center items-end gap-2.5">
                {/* Rank 2 Card */}
                <div>
                  <RankCard
                    rank={2}
                    rankData={data?.data?.[1]}
                    isFollowed={
                      followStatus?.[data?.data?.[1]?.id] ??
                      data?.data?.[1]?.is_followed
                    }
                    user={user}
                    handleFollow={handleFollow}
                  />
                </div>

                {/* Rank 1 Card */}
                <div className="pb-5">
                  <RankCard
                    rank={1}
                    rankData={data?.data?.[0]}
                    isFollowed={
                      followStatus?.[data?.data?.[0]?.id] ??
                      data?.data?.[0]?.is_followed
                    }
                    user={user}
                    handleFollow={handleFollow}
                  />
                </div>

                {/* Rank 3 Card */}
                <div>
                  <RankCard
                    rank={3}
                    rankData={data?.data?.[2]}
                    isFollowed={
                      followStatus?.[data?.data?.[2]?.id] ??
                      data?.data?.[2]?.is_followed
                    }
                    user={user}
                    handleFollow={handleFollow}
                  />
                </div>
              </div>
            </div>
            <p className="text-center text-[12px] text-white/60 mt-3">
              创作者成为闪亮之星，从创作者开始。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorRankingSection;
