// import { useDispatch } from "react-redux";
// import { setShow } from "../services/showSlice";

// interface Follower {
//   id: string;
//   name: string;
//   my_day?: any;
//   decryptedPreview: string;
// }

// const Followers = ({ followers }: any) => {
//   const dispatch = useDispatch();
//   return (
//     <div className="flex gap-4 overflow-x-auto hide-sb mt-20 w-full px-5 mb-3">
//       {followers.map((follower: Follower) => (
//         <div
//           key={follower.id}
//           className="flex-shrink-0  flex w-[80px] justify-center items-center flex-col p-1 gap-1"
//         >
//           <div
//             onClick={() => dispatch(setShow(follower.id))}
//             className="w-[77px] h-[77px] rounded-full p-[2px]  breathing-effect"
//             style={{
//               background: !follower?.my_day.watched
//                 ? "linear-gradient(#16131C 0 0) padding-box, " +
//                   "linear-gradient(90deg, #e8b9ff 0%, #ff94b4 82.89%) border-box"
//                 : "linear-gradient(#16131C 0 0) padding-box, " +
//                   "rgba(255, 255, 255, 0.40) border-box",
//               border: "2px solid transparent",
//               padding: "3px",
//             }}
//           >
//             <img
//               src={follower.decryptedPreview}
//               alt={follower.name}
//               className="w-full h-full rounded-full object-cover"
//             />
//           </div>
//           {/* {!follower?.uploaded ? (

//           ) : (
//             <div className="w-[57px] h-[57px] rounded-full p-[2px]">
//               <img
//                 src={follower.decryptedPreview}
//                 alt={follower.name}
//                 className="w-full h-full rounded-full object-cover"
//               />
//             </div>
//           )} */}

//           <span className="myday_name truncate w-[60px]">{follower.name}</span>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Followers;

import { useDispatch } from "react-redux";
import { setShow } from "../services/showSlice";

interface Follower {
  id: string;
  name: string;
  my_day?: any;
  decryptedPreview: string;
}

const Followers = ({ followers }: any) => {
  const dispatch = useDispatch();
  return (
    <div className="flex gap-4 overflow-x-auto hide-sb mt-20 w-full px-5 mb-3">
      {followers.map((follower: Follower) => (
        <div
          key={follower.id}
          className="flex-shrink-0 flex w-[80px] justify-center items-center flex-col p-1 gap-1"
        >
          <div className="relative w-[77px] h-[77px]">
            {/* Border element with breathing effect */}
            <div
              className={`absolute inset-0 rounded-full p-[0px] breathing-border`}
              style={{
                background: !follower?.my_day.watched
                  ? "linear-gradient(#16131C 0 0) padding-box, " +
                    "linear-gradient(90deg, #e8b9ff 0%, #ff94b4 82.89%) border-box"
                  : "linear-gradient(#16131C 0 0) padding-box, " +
                    "rgba(255, 255, 255, 0.40) border-box",
                border: "4px solid transparent",
                padding: "0px",
              }}
            />
            {/* Static image */}
            <img
              onClick={() => dispatch(setShow(follower.id))}
              src={follower.decryptedPreview}
              alt={follower.name}
              className="absolute inset-0 w-full h-full rounded-full object-cover"
              style={{
                transform: "scale(0.85)", // Adjust this value to control image size within border
              }}
            />
          </div>
          <span className="myday_name truncate w-[60px] text-center text-xs">
            {follower.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Followers;
