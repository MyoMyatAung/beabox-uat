import Upload from "./upload";
import VideoCard from "./video-card";

const VideoGrid = ({ isUpload }: any) => {
  return (
    <div className="py-4 pb-28">
      <div className="grid grid-cols-3 gap-2">
        {isUpload ? <Upload /> : <></>}
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
      </div>
    </div>
  );
};

export default VideoGrid;
