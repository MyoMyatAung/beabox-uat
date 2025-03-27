import FilterType from "@/components/ranking/filter-type";
import OtherRank from "@/components/ranking/other-rank";
import Top3 from "@/components/ranking/top3";
import InfinitLoad from "@/components/shared/infinit-load";
import {
  useGetConfigQuery,
  useGetTopCreatorQuery,
} from "@/store/api/createCenterApi";
import { useEffect, useState } from "react";

const Ranking = () => {
  const [selectedType, setSelectedType] = useState<any>({});
  const [selectedRange, setSelectedRange] = useState<any>({});
  const [page, setPage] = useState(1);
  const [rankingData, setRankingData] = useState<any>([]);
  const [hasMore, setHasMore] = useState(true);
  const [totalData, setTotalData] = useState<number>(0);
  const { data: configData } = useGetConfigQuery({});
  const { data, isLoading, refetch, isFetching } = useGetTopCreatorQuery({
    page,
    type: selectedRange?.value,
    tag: selectedRange?.keyword,
  });

  useEffect(() => {
    if (
      configData?.status &&
      configData?.data?.creator_center_ranking_filter?.length
    ) {
      setSelectedType(configData?.data?.creator_center_ranking_filter[0]);
      setSelectedRange(
        configData?.data?.creator_center_ranking_filter[0]?.range[0]
      );
    }
  }, [configData]);

  useEffect(() => {
    if (data) {
      setRankingData((prev: any) => [...data?.data?.list]);
      setTotalData(data?.pagination?.total);
    }
  }, [data]);

  useEffect(() => {
    if (totalData <= rankingData?.length) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [totalData, rankingData]);

  const fetchMoreData = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };
  return (
    <div>
      <Header />
      <Top3 rankingData={rankingData} />
      <FilterType
        configData={configData}
        selectedRange={selectedRange}
        setSelectedRange={setSelectedRange}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />
      <OtherRank rankingData={rankingData} />
      <InfinitLoad
        data={rankingData}
        fetchData={fetchMoreData}
        hasMore={hasMore}
      />
    </div>
  );
};

export default Ranking;

const Header = () => {
  return (
    <div className="p-5">
      <h1 className="text-[18px] text-center">排行榜</h1>
    </div>
  );
};
