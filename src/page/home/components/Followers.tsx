import { useNavigate } from "react-router-dom";

interface Follower {
  id: string;
  name: string;
  my_day?: any;
  decryptedPreview: string;
}

interface FollowersProps {
  followers: Follower[];
}

const Followers = ({ followers }: FollowersProps) => {
  console.log(followers);
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-4 overflow-x-auto hide-sb mt-20 w-full px-5 mb-3">
      {followers.map((follower: Follower) => (
        <div
          key={follower.id}
          className="flex-shrink-0 flex-grow flex w-[60px] justify-center items-center flex-col p-1 gap-1"
        >
          <div
            onClick={() => {
              navigate(`story_detail/${follower?.id}`);
            }}
            className="w-[57px] h-[57px] rounded-full p-[2px] animate-pulse-slow"
            style={{
              background: !follower?.my_day.watched
                ? "linear-gradient(#16131C 0 0) padding-box, " +
                  "linear-gradient(90deg, #e8b9ff 0%, #ff94b4 82.89%) border-box"
                : "linear-gradient(#16131C 0 0) padding-box, " +
                  "rgba(255, 255, 255, 0.40) border-box",
              border: "2px solid transparent",
              padding: "3px",
            }}
          >
            <img
              src={follower.decryptedPreview}
              alt={follower.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          {/* {!follower?.uploaded ? (
          
          ) : (
            <div className="w-[57px] h-[57px] rounded-full p-[2px]">
              <img
                src={follower.decryptedPreview}
                alt={follower.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          )} */}

          <span className="myday_name truncate w-[60px]">{follower.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Followers;
