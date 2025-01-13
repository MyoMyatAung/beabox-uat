import { useEffect } from "react";
import Landing from "./components/Landing";
import Routing from "./routes/Routing";
import { useDispatch, useSelector } from "react-redux";
import { setPanding } from "./store/slices/ModelSlice";

const App = () => {
  const { panding } = useSelector((state: any) => state.model);
  console.log(panding);
  const dispatch = useDispatch();

  useEffect(() => {
    const hasSeenLanding = sessionStorage.getItem("hasSeenLanding");
    if (!hasSeenLanding) {
      sessionStorage.setItem("hasSeenLanding", "true");
      dispatch(setPanding(true));
    }
  }, [dispatch]);
  return <>{panding ? <Landing /> : <Routing />}</>;
};

export default App;
