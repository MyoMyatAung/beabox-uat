import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Profile from "./Profile";
import OtherProfile from "./OtherProfile";

const Main = () => {
  const { id } = useParams();
  const user = useSelector((state: any) => state?.persist?.user) || "";

  if (user?.id == id) {
    return <Profile />;
  } else {
    console.log("seeeewin");
    return <OtherProfile />;
  }
};

export default Main;
