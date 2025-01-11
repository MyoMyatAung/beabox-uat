import Upload from "./upload";
import VideoCard from "./video-card";

const VideoGrid = ({ isUpload, data }: any) => {
  return (
    <div className="py-4 pb-28">
      <div className="grid grid-cols-3 gap-2">
        {isUpload ? <Upload /> : <></>}
        {data?.map((item: any) => (
          <VideoCard key={item?.id} videoData={item} />
        ))}
      </div>
    </div>
  );
};

export default VideoGrid;
