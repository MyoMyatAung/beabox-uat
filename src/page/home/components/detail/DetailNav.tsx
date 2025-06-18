import { decryptImage } from "@/utils/imageDecrypt";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useDeletePostMutation } from "@/store/api/createCenterApi";
import { setShow } from "../../services/showSlice";

const DetailNav = ({
  image,
  name,
  length,
  currentIndex,
  id,
  post_id,

  // refetch,
  setIsDecrypting,
}: any) => {
  const [decryptedPhoto, setDecryptedPhoto] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const user = useSelector((state: any) => state.persist.user);
  const [deletePost] = useDeletePostMutation();
  const dispatch = useDispatch();

  const navigate = useNavigate();
  useEffect(() => {
    const loadAndDecryptPhoto = async () => {
      if (!image) {
        setDecryptedPhoto("");
        return;
      }

      try {
        const photoUrl = image;

        // If it's not a .txt file, assume it's already a valid URL
        if (!photoUrl.endsWith(".txt")) {
          setDecryptedPhoto(photoUrl);
          return;
        }
        const decryptedUrl = await decryptImage(photoUrl);
        setDecryptedPhoto(decryptedUrl);
      } catch (error) {
        console.error("Error loading profile photo:", error);
        setDecryptedPhoto("");
      }
    };

    loadAndDecryptPhoto();
  }, [image]);

  const handleDelete = () => {
    setIsDecrypting(true);
    try {
      console.log("Deleting post with ID:", post_id);
      deletePost({ id: post_id }).unwrap();
      // refetch();
      setShowDelete(false);

      setIsDecrypting(false);
    } catch (error) {
      setIsDecrypting(false);
    }
  };

  return (
    <div className="z-[999999] videoNavbar">
      <div className="w-full flex gap-1 mb-4">
        {Array.from({ length }).map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-500 bg-opacity-40"
            }`}
            style={{
              transition: "width 0.3s ease",
            }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <button
          className="flex items-center gap-2"
          onClick={() => navigate(`/user/${id}`)}
        >
          {decryptedPhoto && (
            <Avatar className="w-[40.25px] h-[40.25px]">
              <AvatarImage src={decryptedPhoto} />
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
          )}

          <h1 className="detail_nav_name">{name}</h1>
        </button>
        <div className="flex items-center gap-2">
          {user?.id === id && (
            <button
              className="detail_cross_btn"
              onClick={() => setShowDelete(!showDelete)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3 10C4.10457 10 5 10.8954 5 12C5 13.1046 4.10457 14 3 14C1.89543 14 1 13.1046 1 12C1 10.8954 1.89543 10 3 10ZM12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10ZM21 10C22.1046 10 23 10.8954 23 12C23 13.1046 22.1046 14 21 14C19.8954 14 19 13.1046 19 12C19 10.8954 19.8954 10 21 10Z"
                  fill="white"
                />
              </svg>
            </button>
          )}

          <button
            className="detail_cross_btn"
            onClick={() => {
              if (location.pathname.includes("/story_detail")) {
                // If the current path is a detail page, navigate back to the home page
                navigate(-1);
              } else {
                dispatch(setShow(""));
                console.log("Cross button clicked");
                // If the current path is not a detail page, navigate back to the previous page
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M17.75 6.25L6.25 17.75"
                stroke="white"
                stroke-width="1.49593"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.25 6.25L17.75 17.75"
                stroke="white"
                stroke-width="1.49593"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
        {user?.id === id && (
          <div className="absolute top-20 right-5 z-[999]">
            {showDelete && (
              <button className="delete_nav" onClick={handleDelete}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 21 21"
                  fill="none"
                >
                  <g clip-path="url(#clip0_754_5648)">
                    <path
                      d="M2.58789 5.08777H17.5879"
                      stroke="#FF5252"
                      stroke-width="1.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M15.9206 5.08777V16.7544C15.9206 17.5878 15.0872 18.4211 14.2539 18.4211H5.92057C5.08724 18.4211 4.25391 17.5878 4.25391 16.7544V5.08777"
                      stroke="#FF5252"
                      stroke-width="1.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M6.75391 5.08785V3.42118C6.75391 2.58785 7.58724 1.75452 8.42057 1.75452H11.7539C12.5872 1.75452 13.4206 2.58785 13.4206 3.42118V5.08785"
                      stroke="#FF5252"
                      stroke-width="1.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_754_5648">
                      <rect
                        width="20"
                        height="20"
                        fill="white"
                        transform="translate(0.0878906 0.0877686)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <span>删除视频</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailNav;
