/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from 'react'
import Landing from "./components/Landing";
import Routing from "./routes/Routing";
import { useDispatch, useSelector } from "react-redux";
import { setPanding } from "./store/slices/ModelSlice";
import ErrorToast from "./page/home/services/ErrorToast";
import { toast } from "@/hooks/use-toast";
import { Toaster } from './components/ui/toaster';

const App = () => {
  const { panding } = useSelector((state: any) => state.model);

  const dispatch = useDispatch();
  const [dataFromIOS, setDataFromIOS] = useState('')

  useEffect(() => {

      // Adding event for IOS app
      window.addEventListener('iosEvent', iosEventHandler);

      return () =>
          window.removeEventListener('iosEvent', iosEventHandler);
  }, [])

  const iosEventHandler = useCallback(
      (e: any) => {
          alert(e);
          toast(e);
          console.log(e);
          setDataFromIOS(e);
      },
      [setDataFromIOS]
  )
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
      (window as any).webkit.messageHandlers.jsBridge.postMessage(
        message
      );
  }
};

useEffect(()=>{
  if(panding) {
    sendNativeEvent('beabox_ads_started');
  } else {
    sendNativeEvent('beabox_home_started');
  }
},[panding]);

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
