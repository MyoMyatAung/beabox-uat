import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowCard from "./follow-card";
import { Input } from "../ui/input";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";

const FollowTabs = () => {
  const defaultFollowTab = useSelector(
    (state: any) => state.profile.defaultFollowTab
  );
  return (
    <Tabs defaultValue={defaultFollowTab} className="my-5">
      <TabsList className="grid w-[250px] mx-auto grid-cols-2 bg-transparent">
        <TabsTrigger
          className="text-[#888888] data-[state=active]:text-white text-[15px] flex items-center"
          value="follower"
        >
          <span className="">Follower</span>
        </TabsTrigger>
        <TabsTrigger
          className="text-[#888888] data-[state=active]:text-white text-[12px] flex items-center"
          value="following"
        >
          Following
        </TabsTrigger>
      </TabsList>
      <div className="bg-[#111111] w-full rounded-full shadow-md my-5 flex items-center pl-4">
        <FaSearch />
        <Input
          placeholder="Search User"
          className="bg-[#111111] rounded-full border-0  "
        />
      </div>
      <TabsContent value="follower">
        <div className="flex flex-col gap-4 w-full no-scrollbar h-screen pb-20">
          <FollowCard following={true} />
          <FollowCard />
          <FollowCard />
          <FollowCard />
          <FollowCard />
          <FollowCard />
          <FollowCard />
          <FollowCard />
          <FollowCard />
          <FollowCard />
          <FollowCard />
          <FollowCard />
          <FollowCard />
          <FollowCard />
        </div>
      </TabsContent>
      <TabsContent value="following">
        <div className="flex flex-col gap-4 w-full no-scrollbar h-screen pb-20">
          <FollowCard following={true} />
          <FollowCard following={true} />
          <FollowCard following={true} />
          <FollowCard following={true} />
          <FollowCard following={true} />
          <FollowCard following={true} />
          <FollowCard following={true} />
          <FollowCard following={true} />
          <FollowCard following={true} />
          <FollowCard following={true} />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default FollowTabs;
