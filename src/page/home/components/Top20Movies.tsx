// import { useTop20PostsQuery } from "../services/homeApi";
// import loader from "../vod_loader.gif";

// const Top20Movies = ({ setTopMovies }: { setTopMovies: any }) => {
//   const { data, isLoading, isError } = useTop20PostsQuery({});

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-black text-white">
//         <img src={loader} className="w-[100px] h-[100px]" />
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-black text-red-500">
//         Failed to load Top 20 Movies.
//       </div>
//     );
//   }

//   const firstMovie = data?.data[0];

//   return (
//     <div className="bg-black min-h-screen text-white">
//       {/* Header Section */}
//       {firstMovie && (
//         <div
//           className="relative h-64 bg-cover bg-center flex items-center"
//           style={{
//             backgroundImage: `url(${firstMovie.preview_image})`,

//             backgroundRepeat: "no-repeat",
//           }}
//         >
//           <button
//             onClick={() => setTopMovies(false)}
//             className="z-20 absolute top-5 left-5"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="10"
//               height="14"
//               viewBox="0 0 10 14"
//               fill="none"
//             >
//               <path
//                 d="M9.26486 0.490513C9.16585 0.406457 9.04823 0.339768 8.91875 0.294266C8.78926 0.248764 8.65044 0.225342 8.51025 0.225342C8.37006 0.225342 8.23124 0.248764 8.10175 0.294266C7.97226 0.339768 7.85465 0.406457 7.75564 0.490513L0.670011 6.49096C0.590966 6.55776 0.528255 6.63711 0.485467 6.72446C0.442679 6.81181 0.420654 6.90545 0.420654 7.00002C0.420654 7.09459 0.442679 7.18823 0.485467 7.27558C0.528255 7.36293 0.590966 7.44228 0.670011 7.50908L7.75564 13.5095C8.17345 13.8633 8.84705 13.8633 9.26486 13.5095C9.68266 13.1557 9.68266 12.5853 9.26486 12.2315L3.09157 6.99641L9.27338 1.76136C9.68266 1.41477 9.68266 0.837109 9.26486 0.490513Z"
//                 fill="white"
//               />
//             </svg>
//           </button>
//           <div className="absolute inset-0 bg-black bg-opacity-50"></div>
//           <h1 className="relative z-10 ml-10 font-headerFont">Top 20 Movies</h1>
//           <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-t from-black via-black/10 to-transparent"></div>
//         </div>
//       )}

//       {/* Movies List */}
//       <ul className="px-4 py-6 pb-20 space-y-4">
//         {data?.data.map((movie: any, index: number) => (
//           <li
//             key={movie.post_id}
//             className="flex items-center justify-between pb-4 "
//           >
//             <div className="flex items-center flex-1 space-x-4">
//               <span
//                 className={`text-xl font-bold ${
//                   [0, 1, 2].includes(index) ? "text-[#D5B18A]" : "text-gray-300"
//                 }`}
//               >
//                 {index + 1}.
//               </span>
//               <div className="flex-1 w-[200px]">
//                 <h2 className="top-text truncate">{movie.title}</h2>
//               </div>
//             </div>

//             <div className="flex items-center  text-gray-400 ml-5">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="12"
//                 height="12"
//                 viewBox="0 0 12 12"
//                 fill="none"
//               >
//                 <path
//                   d="M9.44841 5.46682C9.29507 5.26682 9.1084 5.09348 8.93506 4.92014C8.48838 4.52013 7.9817 4.23345 7.55502 3.81344C6.56166 2.84008 6.34166 1.23337 6.97501 0C6.34166 0.153338 5.78831 0.500014 5.31496 0.880025C3.58824 2.26673 2.90823 4.71347 3.72158 6.81353C3.74825 6.8802 3.77492 6.94686 3.77492 7.03353C3.77492 7.1802 3.67491 7.31354 3.54158 7.36688C3.38824 7.43355 3.22823 7.39354 3.10156 7.28687C3.06373 7.25518 3.03208 7.21675 3.00823 7.17354C2.25487 6.22018 2.13487 4.85347 2.64155 3.76011C1.52819 4.6668 0.921502 6.20018 1.00817 7.64688C1.04817 7.98023 1.08817 8.31357 1.20151 8.64691C1.29485 9.04692 1.47485 9.44694 1.67486 9.80028C2.39488 10.9536 3.64158 11.7803 4.98162 11.947C6.40833 12.127 7.93504 11.867 9.0284 10.8803C10.2484 9.77361 10.6751 8.00023 10.0484 6.48018L9.96176 6.30685C9.82176 6.00017 9.44841 5.46682 9.44841 5.46682ZM7.34168 9.66694C7.15501 9.82695 6.84834 10.0003 6.60833 10.067C5.86164 10.3336 5.11495 9.96028 4.67494 9.52027C5.4683 9.3336 5.94164 8.74691 6.08165 8.15357C6.19499 7.62022 5.98165 7.1802 5.89498 6.66686C5.81497 6.17351 5.82831 5.7535 6.00831 5.29348C6.13498 5.54682 6.26832 5.80017 6.42833 6.00017C6.94167 6.66686 7.74836 6.9602 7.9217 7.86689C7.94837 7.96023 7.9617 8.05356 7.9617 8.15357C7.9817 8.70025 7.7417 9.30026 7.34168 9.66694Z"
//                   fill="#AAAAAA"
//                 />
//               </svg>
//               <span className="ml-1">{movie.like_count}k</span>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Top20Movies;

import { useState } from "react";
import { useTop20PostsQuery } from "../services/homeApi";
import loader from "../vod_loader.gif";
import VideoFeed from "./VideoFeed";

const Top20Movies = ({ setTopMovies }: { setTopMovies: any }) => {
  const { data, isLoading, isError } = useTop20PostsQuery({});
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [showVideoFeed, setShowVideoFeed] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <img src={loader} className="w-[100px] h-[100px]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-red-500">
        Failed to load Top 20 Movies.
      </div>
    );
  }

  const firstMovie = data?.data[0];
  const moviesList = data?.data;

  // If a movie is selected, display the `VideoFeed` component
  if (showVideoFeed && selectedMovieId) {
    return (
      <VideoFeed
        videos={moviesList}
        currentActiveId={selectedMovieId}
        setShowVideoFeed={setShowVideoFeed}
      />
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Header Section */}
      {firstMovie && (
        <div
          className="relative h-64 bg-cover bg-center flex items-center"
          style={{
            backgroundImage: `url(${firstMovie.preview_image})`,
            backgroundRepeat: "no-repeat",
          }}
        >
          <button
            onClick={() => setTopMovies(false)}
            className="z-20 absolute top-5 left-5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="14"
              viewBox="0 0 10 14"
              fill="none"
            >
              <path
                d="M9.26486 0.490513C9.16585 0.406457 9.04823 0.339768 8.91875 0.294266C8.78926 0.248764 8.65044 0.225342 8.51025 0.225342C8.37006 0.225342 8.23124 0.248764 8.10175 0.294266C7.97226 0.339768 7.85465 0.406457 7.75564 0.490513L0.670011 6.49096C0.590966 6.55776 0.528255 6.63711 0.485467 6.72446C0.442679 6.81181 0.420654 6.90545 0.420654 7.00002C0.420654 7.09459 0.442679 7.18823 0.485467 7.27558C0.528255 7.36293 0.590966 7.44228 0.670011 7.50908L7.75564 13.5095C8.17345 13.8633 8.84705 13.8633 9.26486 13.5095C9.68266 13.1557 9.68266 12.5853 9.26486 12.2315L3.09157 6.99641L9.27338 1.76136C9.68266 1.41477 9.68266 0.837109 9.26486 0.490513Z"
                fill="white"
              />
            </svg>
          </button>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <h1 className="relative z-10 ml-10 font-headerFont">Top 20 Movies</h1>
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-t from-black via-black/10 to-transparent"></div>
        </div>
      )}

      {/* Movies List */}
      <ul className="px-4 py-6 pb-20 space-y-4">
        {moviesList.map((movie: any, index: number) => (
          <li
            key={movie.post_id}
            className="flex items-center justify-between pb-4 cursor-pointer"
            onClick={() => {
              setSelectedMovieId(movie.post_id);
              setShowVideoFeed(true);
            }}
          >
            <div className="flex items-center flex-1 space-x-4">
              <span
                className={`text-xl font-bold ${
                  [0, 1, 2].includes(index) ? "text-[#D5B18A]" : "text-gray-300"
                }`}
              >
                {index + 1}.
              </span>
              <div className="flex-1 w-[200px]">
                <h2 className="top-text truncate">{movie.title}</h2>
              </div>
            </div>

            <div className="flex items-center text-gray-400 ml-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M9.44841 5.46682C9.29507 5.26682 9.1084 5.09348 8.93506 4.92014C8.48838 4.52013 7.9817 4.23345 7.55502 3.81344C6.56166 2.84008 6.34166 1.23337 6.97501 0C6.34166 0.153338 5.78831 0.500014 5.31496 0.880025C3.58824 2.26673 2.90823 4.71347 3.72158 6.81353C3.74825 6.8802 3.77492 6.94686 3.77492 7.03353C3.77492 7.1802 3.67491 7.31354 3.54158 7.36688C3.38824 7.43355 3.22823 7.39354 3.10156 7.28687C3.06373 7.25518 3.03208 7.21675 3.00823 7.17354C2.25487 6.22018 2.13487 4.85347 2.64155 3.76011C1.52819 4.6668 0.921502 6.20018 1.00817 7.64688C1.04817 7.98023 1.08817 8.31357 1.20151 8.64691C1.29485 9.04692 1.47485 9.44694 1.67486 9.80028C2.39488 10.9536 3.64158 11.7803 4.98162 11.947C6.40833 12.127 7.93504 11.867 9.0284 10.8803C10.2484 9.77361 10.6751 8.00023 10.0484 6.48018L9.96176 6.30685C9.82176 6.00017 9.44841 5.46682 9.44841 5.46682ZM7.34168 9.66694C7.15501 9.82695 6.84834 10.0003 6.60833 10.067C5.86164 10.3336 5.11495 9.96028 4.67494 9.52027C5.4683 9.3336 5.94164 8.74691 6.08165 8.15357C6.19499 7.62022 5.98165 7.1802 5.89498 6.66686C5.81497 6.17351 5.82831 5.7535 6.00831 5.29348C6.13498 5.54682 6.26832 5.80017 6.42833 6.00017C6.94167 6.66686 7.74836 6.9602 7.9217 7.86689C7.94837 7.96023 7.9617 8.05356 7.9617 8.15357C7.9817 8.70025 7.7417 9.30026 7.34168 9.66694Z"
                  fill="#AAAAAA"
                />
              </svg>
              <span className="ml-1">{movie.like_count}k</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Top20Movies;
