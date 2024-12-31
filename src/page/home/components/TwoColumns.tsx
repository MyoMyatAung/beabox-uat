import TopNavbar from "./TopNavbar";
import loader from "../vod_loader.gif";

const TwoColumns = ({
  currentTab,
  handleTabClick,
  isLoading,
  isError,
  videos,
}: {
  currentTab: any;
  handleTabClick: any;
  isLoading: any;
  isError: any;
  videos: any;
}) => {
  return (
    <div className="app bg-black">
      <TopNavbar currentTab={currentTab} onTabClick={handleTabClick} />

      {isLoading && videos.length === 0 && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div className="heart">
            <img src={loader} className="w-[100px] h-[100px]" alt="Loading" />
          </div>
        </div>
      )}

      {isError && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div className="text-white flex items-center gap-2">
            <span className="text-[28px] font-bold">
              <span className="text-[#FA408D] text-[36px]">Not</span> Found
            </span>
          </div>
        </div>
      )}
      {!isLoading && <h1>Hello Explore</h1>}
    </div>
  );
};

export default TwoColumns;
