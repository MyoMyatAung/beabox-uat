import loader from "@/page/home/vod_loader.gif";
import InfiniteScroll from "react-infinite-scroll-component";

const Loader = () => {
  return (
    <div className="w-full justify-center flex">
      <img src={loader} className="w-12" alt="" />
    </div>
  );
};

const InfinitLoad = ({ data, fetchData, hasMore }: any) => {
  return (
    <>
      {data?.length ? (
        <InfiniteScroll
          dataLength={data?.length}
          next={fetchData}
          hasMore={hasMore}
          loader={
            <div className="flex justify-center items-center w-full">
              <Loader />
            </div>
          }
        >
          <div className="flex justify-center items-center w-full">
            {/* <Loader /> */}
          </div>
        </InfiniteScroll>
      ) : (
        <></>
      )}
    </>
  );
};

export default InfinitLoad;
