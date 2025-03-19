import { useGetAdsQuery } from "@/store/api/createCenterApi";

const Ads = () => {
  const { data } = useGetAdsQuery("");
  console.log(data);
  return (
    <>
      {data ? (
        <a href={data?.data?.creator_center_page?.jump_url} target="__blank">
          <div className="w-full px-5 pt-5">
            <img
              src={data?.data?.creator_center_page?.image?.replace(".js", "")}
              alt=""
              className="rounded-[12px]"
            />
          </div>
        </a>
      ) : (
        <div className="px-5 pt-5">
          <div className="w-full h-[87px] bg-[#8888881F] rounded-[12px] animate-pulse"></div>
        </div>
      )}
    </>
  );
};

export default Ads;
