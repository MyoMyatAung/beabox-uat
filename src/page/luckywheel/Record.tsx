import { FC, Fragment, useEffect, useState } from "react";
import { useRequest } from "ahooks";
import { Dialog, Transition } from "@headlessui/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import InfiniteScroll from "react-infinite-scroll-component";
import "dayjs/locale/zh-cn";
import SpinWheelService from "./services/spinWheelService";

import empty from "../../assets/empty.png";
import { useSelector } from "react-redux";

dayjs.locale("zh-cn");
dayjs.extend(relativeTime);

type RecordProps = {
  show: boolean;
  onClose: any;
};

export const Record: FC<RecordProps> = ({ show, onClose }) => {
  const user = useSelector((state: any) => state.persist.user);

  const [fetching, setFetching] = useState(false);
  const [pageConfig, setPageConfig] = useState({
    page: 1,
    pageSize: 10,
  });
  const [dataList, setData] = useState<any[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false); // New state for pagination loading

  const { data, error, loading, refresh } = useRequest<any, any>(
    () => {
      const token = user?.token;
      if (!token) return Promise.reject("No access token");
      const service = new SpinWheelService(token);
      return service.getWinHistory(pageConfig.page);
    },
    {
      debounceWait: 300,
      refreshDeps: [pageConfig],
      onSuccess: () => {
        if (pageConfig.page === 1) {
          setInitialLoad(false);
        }
        setIsFetchingMore(false);
      },
      onError: () => {
        setIsFetchingMore(false);
      },
    }
  );

  const fetchMoreData = () => {
    if (dataList.length >= (data?.pagination?.total ?? 0)) return;
    setIsFetchingMore(true);
    setPageConfig((prev) => ({
      ...prev,
      page: prev.page + 1,
    }));
  };

  useEffect(() => {
    if (show) {
      setInitialLoad(true);
      setData([]);
      setPageConfig({ page: 1, pageSize: 10 });
      refresh();
    }
  }, [show]);

  useEffect(() => {
    if (data?.data?.length) {
      setData((prevData) =>
        pageConfig.page === 1 ? [...data.data] : [...prevData, ...data.data]
      );
    }
  }, [data]);

  const handleReload = async () => {
    setInitialLoad(true);
    setData([]);
    setPageConfig({ page: 1, pageSize: 10 });
    await refresh();
  };

  const renderContent = () => {
    if (!user?.token) {
      return (
        <div className="w-full py-6 min-h-[280px] justify-center flex-col items-center gap-2.5 inline-flex">
          <img src={empty} alt="" className="w-[150px] h-[95px]" />
          <div className="text-center text-black text-opacity-40 text-sm font-normal leading-tight">
            暂无抽奖记录
          </div>
        </div>
      );
    }

    if (initialLoad || (loading && pageConfig.page === 1)) {
      return (
        <div className="w-full py-6 min-h-[280px] justify-center flex-col items-center gap-2.5 inline-flex">
          <div className="loader"></div>
          <div className="text-center text-[#D20065] text-[16px] font-normal leading-tight">
            刷新中...
          </div>
        </div>
      );
    }

    if (dataList.length === 0) {
      return (
        <div className="w-full py-6 min-h-[280px] justify-center flex-col items-center gap-2.5 inline-flex">
          <img src={empty} alt="" className="w-[150px] h-[95px]" />
          <div className="text-center text-black text-opacity-40 text-sm font-normal leading-tight">
            暂无抽奖记录
          </div>
        </div>
      );
    }

    return (
      <div className="h-[280px] overflow-y-auto" id={`scrollableDiv-record`}>
        <InfiniteScroll
          className="w-full flex-col justify-start items-start"
          dataLength={dataList.length}
          next={fetchMoreData}
          hasMore={dataList.length < (data?.pagination?.total ?? 0)}
          loader={
            isFetchingMore && (
              <div className="flex justify-center items-center py-2">
                <div className="loader-small"></div>{" "}
                {/* Use a smaller loader */}
              </div>
            )
          }
          scrollableTarget={`scrollableDiv-record`}
        >
          {dataList.map((item: any, key: number) => (
            <div
              className="w-full py-3 border-b border-black border-opacity-5 justify-between items-center inline-flex"
              key={key}
            >
              <div className="text-center text-red-700 text-base font-medium leading-tight">
                {item.prize_name}
              </div>
              <div className="self-stretch flex-col justify-center items-end gap-1 inline-flex">
                <div className="text-center text-black text-opacity-80 text-xs font-normal leading-[14.40px]">
                  {dayjs.unix(item.create_time).fromNow()}
                </div>
                <div className="text-center text-black text-opacity-40 text-xs font-normal leading-[14.40px]">
                  消耗积分：{item.points_used}
                </div>
              </div>
            </div>
          ))}
        </InfiniteScroll>
      </div>
    );
  };

  return (
    <Transition show={show} as={Fragment}>
      <Dialog open={true} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="z-20 fixed inset-0 bg-black/60" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed z-30 inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-80 max-w-sm rounded bg-white p-6 flex gap-4 flex-col">
                <Dialog.Title className="text-black text-base font-medium leading-snug text-center">
                  <div className=" flex justify-between items-center">
                    <span className="text-black text-base font-medium leading-snug text-center">
                      中奖记录
                    </span>
                    <img
                      src="/svgs/reload.svg"
                      alt="reload"
                      className="cursor-pointer hover:opacity-80"
                      onClick={handleReload}
                    />
                  </div>
                </Dialog.Title>
                <Dialog.Description className="flex gap-2 flex-col">
                  {renderContent()}
                  <button
                    className="history_click_htn text-sm py-3 w-full text-white font-medium"
                    onClick={onClose}
                  >
                    确定
                  </button>
                </Dialog.Description>
              </Dialog.Panel>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};
