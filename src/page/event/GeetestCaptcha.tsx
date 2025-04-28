// import React, { useEffect } from "react";

// // Extend the Window interface to include initGeetest
// declare global {
//   interface Window {
//     initGeetest?: (
//       config: {
//         gt: string;
//         challenge: string;
//         offline: boolean;
//         new_captcha: boolean;
//         product: string;
//         width: string;
//       },
//       callback: (captchaObj: any) => void
//     ) => void;
//   }
// }

// const GeetestCaptcha = () => {
//   useEffect(() => {
//     // Fetch CAPTCHA configuration from your backend
//     fetch("/api/getCaptchaConfig")
//       .then((res) => res.json())
//       .then((config) => {
//         // Initialize Geetest
//         initGeetest(
//           {
//             gt: config.gt,
//             challenge: config.challenge,
//             offline: !config.success,
//             new_captcha: config.new_captcha,
//             product: "popup", // or 'float', 'custom', 'bind'
//             width: "100%",
//           },
//           function (captchaObj: any) {
//             captchaObj.appendTo("#captcha-container");
//             captchaObj.onSuccess(function () {
//               const result = captchaObj.getValidate();
//               // Send result to your backend for verification
//               fetch("/api/validateCaptcha", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(result),
//               })
//                 .then((res) => res.json())
//                 .then((data) => {
//                   if (data.success) {
//                     // CAPTCHA passed
//                   } else {
//                     // CAPTCHA failed
//                   }
//                 });
//             });
//           }
//         );
//       });
//   }, []);

//   return <div id="captcha-container"></div>;
// };

// export default GeetestCaptcha;
// function initGeetest(
//   config: {
//     gt: string;
//     challenge: string;
//     offline: boolean;
//     new_captcha: boolean;
//     product: string;
//     width: string;
//   },
//   callback: (captchaObj: any) => void
// ) {
//   // Simulate loading the Geetest library
//   const script = document.createElement("script");
//   script.src = "https://static.geetest.com/static/tools/gt.js";
//   script.async = true;
//   script.onload = () => {
//     if (window.initGeetest) {
//       // Call the Geetest initialization function provided by the library
//       window.initGeetest(config, (captchaObj: any) => {
//         callback(captchaObj);
//       });
//     } else {
//       console.error("Geetest library failed to load.");
//     }
//   };
//   script.onerror = () => {
//     console.error("Failed to load Geetest script.");
//   };
//   document.head.appendChild(script);
// }

import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    initGeetest4?: (
      config: { captchaId: string; product: string },
      callback: (gt: any) => void
    ) => void;
  }
}

const GeetestCaptcha = () => {
  const captchaRef = useRef<HTMLDivElement>(null);
  const gtRef = useRef<any>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://static.geetest.com/v4/gt4.js";
    script.async = true;
    script.onload = initializeCaptcha;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      if (gtRef.current) {
        gtRef.current.destroy(); // Clean up the captcha instance
      }
    };
  }, []);

  const initializeCaptcha = () => {
    if (window.initGeetest4 && captchaRef.current) {
      const captchaId = "3bf5c88f68ff49b654a40ac5528cdc73";
      const product = "popup";

      window.initGeetest4(
        {
          captchaId: captchaId,
          product: product,
        },
        (gt) => {
          gtRef.current = gt;
          gt.appendTo("#captcha");

          // Automatically show the captcha popup
          gt.showBox();

          gt.onSuccess((e: any) => {
            const result = gt.getValidate();
            console.log("Captcha validation result:", result);

            fetch("https://77eewm.qdhgtch.com/api/v1/geetest/captcha/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(result),
            })
              .then((response) => response.json())
              .then((res) => {
                console.log("API response:", res.result);
              })
              .catch((error) => {
                console.error("API error:", error);
              });
          });

          gt.onClose(() => {
            console.log("Captcha was closed");
          });

          gt.onError((error: any) => {
            console.error("Captcha error:", error);
          });
        }
      );
    }
  };

  return (
    <div
      style={{
        margin: "50px 0",
        fontFamily:
          '"PingFangSC-Regular", "Open Sans", Arial, "Hiragino Sans GB", "Microsoft YaHei", "STHeiti", "WenQuanYi Micro Hei", SimSun, sans-serif',
        textAlign: "center",
      }}
    >
      <div
        id="captcha"
        ref={captchaRef}
        style={{
          display: "inline-block",
          height: "50px",
        }}
      ></div>
    </div>
  );
};

export default GeetestCaptcha;
