import { useGetTopCreatorQuery } from "@/store/api/createCenterApi";

const Ranking = () => {
  const { data } = useGetTopCreatorQuery("");
  console.log(data);
  return <div>ranking</div>;
};

export default Ranking;
