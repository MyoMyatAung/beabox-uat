import TopNav from "@/components/create-center/top-nav";
import uwebsite from "@/assets/createcenter/uwebsite.png";
import umobile from "@/assets/createcenter/umobile.png";
import ptips from "@/assets/createcenter/ptips.png";
import { useNavigate } from "react-router-dom";
import { paths } from "@/routes/paths";

const CreatorUpload = () => {
  const navigate = useNavigate();
  return (
    <div>
      <TopNav center={"Select Upload Method"} />

      <div className="px-5 w-full flex justify-center items-center flex-col gap-10 py-5">
        <img
          onClick={() => navigate(paths.creator_upload_video)}
          src={uwebsite}
        />
        <div className="">
          <p className="text-[16px] text-[#FFFFFF99] text-center">
            Web upload is available, <br />
            Please copy the link to login. <br />
            <span className="text-[#CD3EFF]">http://d.23abcd.me</span>
          </p>
        </div>
        <img
          onClick={() => navigate(paths.creator_upload_video)}
          src={umobile}
        />
        <img src={ptips} />
      </div>
    </div>
  );
};

export default CreatorUpload;
