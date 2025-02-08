/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from "react";
import Landing from "./components/Landing";
import Routing from "./routes/Routing";
import { useDispatch, useSelector } from "react-redux";
import { setPanding } from "./store/slices/ModelSlice";
import ErrorToast from "./page/home/services/ErrorToast";

import { Toaster } from "./components/ui/toaster";
import { useGetApplicationAdsQuery } from "./store/api/explore/exploreApi";

const App = () => {
  const { panding } = useSelector((state: any) => state.model);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data } = useGetApplicationAdsQuery("");

  const dispatch = useDispatch();

  useEffect(() => {
    const hasSeenLanding = sessionStorage.getItem("hasSeenLanding");
    if (!hasSeenLanding) {
      sessionStorage.setItem("hasSeenLanding", "true");
      dispatch(setPanding(true));
    }
  }, [dispatch]);

  const sendNativeEvent = (message: string) => {
    if (
      (window as any).webkit &&
      (window as any).webkit.messageHandlers &&
      (window as any).webkit.messageHandlers.jsBridge
    ) {
      (window as any).webkit.messageHandlers.jsBridge.postMessage(message);
    }
  };

  useEffect(() => {
    if (panding) {
      sendNativeEvent("beabox_ads_started");
    } else {
      sendNativeEvent("beabox_home_started");
    }
  }, [panding]);

  return (
    <>
      {panding ? (
        <Landing />
      ) : (
        <>
          {" "}
          <Routing />
          <Toaster />
          <ErrorToast />
        </>
      )}
    </>
  );
};

export default App;
