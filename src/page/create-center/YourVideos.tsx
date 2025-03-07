import FilterNav from "@/components/create-center/filter-nav";
import TopNav from "@/components/create-center/top-nav";
import UploadList from "@/components/create-center/upload-list";
import { Trash } from "lucide-react";

const YourVideos = () => {
  return (
    <>
      {/* <div className="sticky top-0"> */}
      <TopNav center={"Your Videos"} right={<Trash size={18} />} />
      <FilterNav />
      {/* </div> */}
      <UploadList />
      <UploadList />
      <UploadList />
      <UploadList />
      <div className="pb-10"></div>
    </>
  );
};

export default YourVideos;
