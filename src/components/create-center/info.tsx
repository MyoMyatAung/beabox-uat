import { useGetConfigQuery } from "@/store/api/createCenterApi";
import { useEffect } from "react";

const Info = ({ status }: any) => {
  const { data, refetch } = useGetConfigQuery({});
  const newData = data?.data?.creator_center_post_filter;
  const owndata = newData?.filter((item: any) => item?.keyword == status);
  const textcolor = owndata && owndata[0]?.text_color_code;
  const bgcolor = owndata && owndata[0]?.bg_color_code;
  console.log(owndata);
  useEffect(() => {
    refetch();
  }, [status]);
  return (
    <div className={`bg-[${bgcolor}] m-5 p-3 rounded-[12px]`}>
      <p>
        <span
          className={`text-[${textcolor}] text-[18px] capitalize font-semibold`}
        >
          {status} -
        </span>
        <span className={`text-[16px] text-[${textcolor}]`}>
          This video is now published. Keep creating and sharing great content!
        </span>
      </p>
    </div>
  );
};

export default Info;
