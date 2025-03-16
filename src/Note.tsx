import TopNav from "@/components/create-center/top-nav";
import axios from "axios";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Privacy from "@/components/create-center/privacy";
import selected from "@/assets/createcenter/selected.png";
import unselected from "@/assets/createcenter/unselected.png";
import { Link } from "react-router-dom";
import { paths } from "@/routes/paths";
import { useGetConfigQuery } from "./store/api/createCenterApi";
const Selected = () => (
  <img className="w-[18px] h-[18px]" src={selected} alt="" />
);
const Unselected = () => (
  <img className="w-[18px] h-[18px]" src={unselected} alt="" />
);

const VideoUpload = () => {
  const [agree, setAgree] = useState(false);
  const { data: cdata } = useGetConfigQuery({});
  const link = cdata?.data?.website_upload_link;
  const [files, setFiles] = useState<any>([]);
  const [thumbnail, setThumbnail] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [privacy, setPrivacy] = useState("public");
  const [contentTitle, setContentTitle] = useState("");
  const [hashtags, setHashtags] = useState<any>([]);
  const [newHashtag, setNewHashtag] = useState("");
  const [agreeToGuidelines, setAgreeToGuidelines] = useState(false);

  // Handle video file drop
  const onDrop = useCallback(async (acceptedFiles: any) => {
    const videoFile = acceptedFiles.find((file: any) =>
      file.type.startsWith("video/")
    );

    if (!videoFile) {
      //   message.error("Please select a valid video file.");
      return;
    }

    if (acceptedFiles.length > 1) {
      //   message.error("You can only upload one video.");
      return;
    }

    // Generate thumbnail for the video
    const generatedThumbnail: any = await generateThumbnail(videoFile);
    setThumbnail(generatedThumbnail);

    // Add video to files state
    setFiles([
      {
        video: videoFile,
        size: videoFile.size,
        type: "video",
      },
    ]);
  }, []);

  // Handle thumbnail drop
  const onThumbnailDrop = useCallback((acceptedFiles: any) => {
    const thumbnailImage = acceptedFiles.find((file: any) =>
      file.type.startsWith("image/")
    );

    if (acceptedFiles.length > 1) {
      //   message.error("You can only upload one image for the thumbnail.");
      return;
    }

    if (thumbnailImage) {
      setThumbnail(thumbnailImage);
    } else {
      //   message.error("Please upload a valid image for the thumbnail.");
    }
  }, []);

  // Generate thumbnail from video
  const generateThumbnail = (videoFile: any) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(videoFile);

      video.onloadeddata = () => {
        video.currentTime = 1; // Seek to a specific timestamp
      };

      video.onseeked = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx: any = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const fileName = `${Date.now()}.jpg`; // Generate a unique file name
              const file = new File([blob], fileName, {
                type: "image/jpeg",
              });
              resolve(file); // Resolve with the File object
            } else {
              reject(new Error("Failed to generate thumbnail"));
            }
          },
          "image/jpeg",
          0.9 // Quality factor for JPEG compression
        );

        URL.revokeObjectURL(video.src); // Clean up resources
      };

      video.onerror = () => reject(new Error("Failed to generate thumbnail"));
    });
  };

  // Dropzone for video upload
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "video/*": [] },
    onDrop,
  });

  // Dropzone for thumbnail upload
  const {
    getRootProps: getThumbnailRootProps,
    getInputProps: getThumbnailInputProps,
  } = useDropzone({
    accept: { "image/*": [] },
    onDrop: onThumbnailDrop,
  });

  // Handle form submission
  const handleSubmit = async () => {
    if (files.length === 0) {
      //   message.error("Please upload a video.");
      return;
    }

    if (!thumbnail) {
      //   message.error("Please upload a thumbnail.");
      return;
    }

    if (!contentTitle) {
      //   message.error("Please enter a content title.");
      return;
    }

    if (hashtags.length === 0) {
      //   message.error("Please add at least one hashtag.");
      return;
    }

    if (!agreeToGuidelines) {
      //   message.error("Please agree to the upload guidelines.");
      return;
    }

    setUploading(true);
    setUploadPercentage(0);

    try {
      // Fetch AWS S3 credentials
      const response = await axios.get(
        "http://156.251.244.194:5343/upload.php"
      );
      const {
        accessKeyId,
        secretAccessKey,
        sessionToken,
        region,
        bucket,
        publicUrl,
        directory,
      } = response.data;
      // Initialize S3 client
      const s3 = new S3Client({
        region,
        credentials: { accessKeyId, secretAccessKey, sessionToken },
      });
      // Function to upload a file to S3
      const uploadFileToS3 = async (file: any, key: any, contentType: any) => {
        const uploadParams = {
          Bucket: bucket,
          Key: `${directory}/${key}`,
          Body: file,
          ContentType: contentType,
          ContentDisposition: "inline",
        };
        const upload = new Upload({
          client: s3,
          leavePartsOnError: false,
          params: uploadParams,
        });
        return new Promise((resolve, reject) => {
          upload.on("httpUploadProgress", (progressEvent: any) => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadPercentage(progress);
          });
          upload.done().then(resolve).catch(reject);
        });
      };
      // Upload video file
      const videoFile = files[0].video;
      const videoKey = `video_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}.${videoFile.name.split(".").pop()}`;
      await uploadFileToS3(videoFile, videoKey, videoFile.type);
      // Upload thumbnail file
      const thumbnailKey = `thumbnail_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}.${thumbnail.name.split(".").pop()}`;
      await uploadFileToS3(thumbnail, thumbnailKey, thumbnail.type);
      // Construct the public URLs for the uploaded files
      const videoUrl = `${publicUrl}${directory}/${videoKey}`;
      const thumbnailUrl = `${publicUrl}${directory}/${thumbnailKey}`;
      // Log the uploaded file URLs (you can replace this with your API call to save the URLs)
      console.log("Video URL:", videoUrl);
      console.log("Thumbnail URL:", thumbnailUrl);
      // Show success message
      //   message.success("Video uploaded successfully!");
      setFiles([]);
      setThumbnail(null);
      setContentTitle("");
      setHashtags([]);
      setNewHashtag("");
      setAgreeToGuidelines(false);
    } catch (error) {
      console.error("Upload failed:", error);
      //   message.error("Failed to upload video. Please try again.");
    } finally {
      setUploading(false);
      setUploadPercentage(0);
    }
  };

  const addHashtag = () => {
    if (newHashtag.trim() === "") {
      //   message.error("Please enter a valid hashtag.");
      return;
    }

    if (hashtags.length >= 5) {
      //   message.error("You can only add up to 5 hashtags.");
      return;
    }

    setHashtags([...hashtags, newHashtag.trim()]);
    setNewHashtag("");
  };
  return (
    <div className="flex flex-col justify-between h-screen">
      <div className="pb-20">
        <TopNav center={"Upload Video"} />
        <div className="flex items-center justify-center mx-5 gap-3 pt-5">
          <div className="flex flex-col justify-center items-center">
            <div className="preview-container">
              {files?.length > 0 ? (
                <div className="preview-item">
                  <video
                    src={URL.createObjectURL(files[0].video)}
                    className="preview-video"
                    controls
                  />
                  {uploading && (
                    <div className="upload-progress">
                      <div className="progress-text">
                        Uploading {uploadPercentage}%
                      </div>
                    </div>
                  )}
                  {!uploading && (
                    <button
                      onClick={() => setFiles([])}
                      className="upload-progress1"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ) : (
                <div {...getRootProps()} className="dropzone">
                  <div className="flex items-center justify-center">
                    <input {...getInputProps()} alt="" />
                    <div className="flex flex-col items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="26"
                        viewBox="0 0 40 26"
                        fill="none"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M0 4.79749C0 2.14772 2.14766 0 4.79749 0H27.2256C29.8734 0 32.0231 2.14767 32.0231 4.79749V6.26851L36.4029 3.7403C38.0014 2.81652 40 3.97174 40 5.81737V19.0017C40 20.8493 38.0014 22.0026 36.4029 21.0807L32.0231 18.5506V20.2452C32.0231 22.895 29.8735 25.0427 27.2256 25.0427H4.79749C2.14772 25.0427 0 22.895 0 20.2452V4.79749ZM21.5595 13.0803C21.989 12.8331 21.989 12.2114 21.5595 11.9623L13.3139 7.20399C12.8843 6.9549 12.3469 7.26479 12.3469 7.76299V17.2814C12.3469 17.7777 12.8843 18.0895 13.3139 17.8404L21.5595 13.0803Z"
                          fill="white"
                          fill-opacity="0.4"
                        />
                      </svg>
                      <span className="text-[10px] text-[#888] mt-2">
                        Click to Upload Video
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <p className="text-[12px] text-[#888] text-center pt-2">
              Video size must not exceed <br />
              100MB
            </p>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="preview-container">
              {thumbnail ? (
                <>
                  <div className="thumbnail-preview">
                    <img
                      src={URL.createObjectURL(thumbnail)}
                      alt="thumbnail preview"
                      className="preview-image"
                    />
                    <button
                      onClick={() => setThumbnail(null)}
                      className="upload-progress1"
                    >
                      Remove
                    </button>
                  </div>
                </>
              ) : (
                <div {...getThumbnailRootProps()} className="dropzone">
                  <div className="flex items-center justify-center">
                    <input {...getThumbnailInputProps()} alt="" />
                    <div className="flex flex-col items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="36"
                        height="24"
                        viewBox="0 0 36 24"
                        fill="none"
                      >
                        <path
                          d="M25.1043 11.5729L35.0289 21.4975C35.0252 21.503 35.0197 21.5104 35.0141 21.516C34.9624 21.5861 34.9107 21.6544 34.8572 21.7209C34.8516 21.7283 34.8443 21.7357 34.8406 21.7412C34.7852 21.8077 34.7261 21.8742 34.667 21.9406C34.6578 21.9536 34.6467 21.9647 34.6356 21.9776C34.5765 22.0404 34.5174 22.1013 34.4547 22.1604C34.4417 22.1715 34.4306 22.1825 34.4196 22.1936C34.3568 22.2545 34.2922 22.3136 34.2257 22.3709C34.2183 22.3764 34.2128 22.3801 34.2054 22.3875C34.1408 22.4429 34.0724 22.4964 34.0041 22.55C33.9967 22.5555 33.9893 22.5611 33.982 22.5666C33.9118 22.6183 33.8416 22.67 33.7696 22.718C33.7567 22.7272 33.7438 22.7346 33.7308 22.7438C33.6607 22.7919 33.5868 22.838 33.513 22.8805C33.5 22.8879 33.4871 22.8953 33.4742 22.9026C33.3985 22.947 33.3209 22.9894 33.2415 23.03C33.236 23.0337 33.2323 23.0356 33.2268 23.0374C33.1492 23.0781 33.0698 23.115 32.9904 23.1501C32.9812 23.1538 32.9701 23.1593 32.9609 23.163C32.8796 23.1981 32.8002 23.2295 32.719 23.2608C32.7042 23.2664 32.6894 23.2719 32.6747 23.2775C32.5934 23.307 32.5122 23.3366 32.4291 23.3606C32.4143 23.3643 32.4014 23.3679 32.3885 23.3735C32.3035 23.3993 32.2149 23.4233 32.1281 23.4455C32.1244 23.4473 32.1226 23.4473 32.1189 23.4473C32.0321 23.4676 31.9453 23.4861 31.8567 23.5027C31.8438 23.5064 31.8327 23.5083 31.8198 23.5101C31.733 23.5267 31.6462 23.5378 31.5594 23.5489C31.5428 23.5507 31.5262 23.5526 31.5096 23.5544C31.4228 23.5637 31.3342 23.5729 31.2455 23.5784C31.2308 23.5803 31.2178 23.5803 31.2031 23.5803C31.1107 23.5858 31.0166 23.5877 30.9243 23.5877L5.07571 23.5895C4.98339 23.5895 4.89291 23.5858 4.80243 23.5821C4.77474 23.5803 4.74704 23.5784 4.71935 23.5766C4.65472 23.5711 4.59009 23.5674 4.52547 23.56C4.49592 23.5563 4.46638 23.5544 4.43869 23.5507C4.36852 23.5434 4.29835 23.5323 4.22819 23.5212C4.20973 23.5175 4.18942 23.5157 4.17095 23.512C4.08233 23.4953 3.99554 23.4787 3.90876 23.4584C3.8866 23.4529 3.86629 23.4473 3.84413 23.4418C3.77951 23.4252 3.71304 23.4086 3.64841 23.3901C3.62071 23.3827 3.59302 23.3735 3.56532 23.3642C3.50439 23.3458 3.44346 23.3255 3.38252 23.3033C3.35667 23.2941 3.33267 23.2867 3.30867 23.2775C3.22558 23.2479 3.14433 23.2147 3.06309 23.1796C3.0557 23.1759 3.04832 23.1722 3.04093 23.1704C2.96892 23.139 2.89691 23.1039 2.8249 23.0688C2.79905 23.0559 2.77504 23.043 2.74919 23.03C2.6938 23.0023 2.64025 22.971 2.58486 22.9414C2.55901 22.9266 2.535 22.9119 2.50915 22.8989C2.44822 22.862 2.38729 22.8251 2.3282 22.7863L2.28389 22.7586C2.21003 22.7106 2.13986 22.6608 2.06785 22.6072C2.04754 22.5924 2.02723 22.5758 2.00692 22.561C1.95522 22.5223 1.90537 22.4835 1.85551 22.441C1.83335 22.4207 1.80935 22.4023 1.78535 22.3819C1.76688 22.3672 1.75026 22.3506 1.73364 22.3339L18.9759 10.9544C20.8981 9.6859 23.4775 9.94626 25.1044 11.5767L25.1043 11.5729Z"
                          fill="white"
                          fill-opacity="0.4"
                        />
                        <path
                          d="M9.95612 7.37113C9.95612 8.48086 9.05508 9.3819 7.94534 9.3819C6.83561 9.3819 5.93457 8.48086 5.93457 7.37113C5.93457 6.26139 6.83561 5.36035 7.94534 5.36035C9.05508 5.36035 9.95612 6.26139 9.95612 7.37113Z"
                          fill="white"
                          fill-opacity="0.4"
                        />
                        <path
                          d="M34.1077 1.12264C33.1974 0.387747 32.0951 0 30.9244 0H5.07588C3.90337 0 2.80291 0.387752 1.8926 1.12264C0.690552 2.09387 0 3.53411 0 5.07588V18.5144C0 19.2936 0.173567 20.0451 0.509607 20.7302L17.8682 9.27313C20.5843 7.48022 24.2254 7.84953 26.5278 10.1502L35.8984 19.5208C35.9649 19.1921 36 18.8561 36 18.5126V5.07408C36 3.53231 35.3094 2.09208 34.1092 1.12084L34.1077 1.12264ZM7.94529 11.3928C5.72772 11.3928 3.92375 9.58879 3.92375 7.37121C3.92375 5.15364 5.72772 3.34967 7.94529 3.34967C10.1629 3.34967 11.9668 5.15548 11.9668 7.37121C11.9668 9.58879 10.1629 11.3928 7.94529 11.3928Z"
                          fill="white"
                          fill-opacity="0.4"
                        />
                      </svg>
                      <span className="upload_text text-center pt-2">
                        Click to Upload Cover <br />
                        (optional)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <p className="text-[12px] text-[#888] text-center pt-2">
              Tap to Select an image <br />
              (Optional)
            </p>
          </div>
        </div>

        <div className="py-5">
          <Privacy privacy={privacy} setPrivacy={setPrivacy} />
        </div>

        <div className="px-5 py-5 flex flex-col gap-10">
          <div className="flex flex-col justify-start">
            <label htmlFor="" className="text-[14px]">
              Content Title
            </label>
            <input
              value={contentTitle}
              onChange={(e) => setContentTitle(e.target.value)}
              type="text"
              className="bg-transparent outline-none border border-t-0 border-x-0 py-2 border-b-[#FFFFFF99]"
              placeholder="Please enter the title"
            />
            <p className="text-[10px] text-[#FFFFFF99] my-1">
              Enter a title. A good title can increase the video click-through
              rate.
            </p>
          </div>

          <div className="flex flex-col justify-start relative">
            <label htmlFor="" className="text-[14px]">
              Hashtags
            </label>
            <input
              value={newHashtag}
              onChange={(e) => setNewHashtag(e.target.value)}
              type="text"
              className="bg-transparent outline-none border border-t-0 border-x-0 py-2 border-b-[#FFFFFF99]"
              placeholder="Add Hashtags (Maximum 5)"
            />
            <Link
              to={paths.tags}
              className="right-0 top-5 px-2 absolute bg-[#F0C3FF66] border-[1px] border-[#F0C3FF] py-1 rounded-full text-[12px] text-[#F0C3FF]"
            >
              Select Tag
            </Link>
          </div>
        </div>

        <div className="text-[14px] text-[#FFFFFF99] flex items-start mx-5">
          <p className="flex min-w-16">
            <span>备注</span> <span className="mx-2">:</span>
          </p>
          <p>
            Web upload is also available, open the link to upload from web :
            <a
              target="__blank"
              href={link ? link : "https://taupe-vacherin-31f51c.netlify.app/"}
              className="text-[#CD3EFF]"
            >
              {link ? link : "https://taupe-vacherin-31f51c.netlify.app/"}
            </a>
          </p>
        </div>
      </div>

      <div className="mx-5 py-5">
        <div className="flex gap-2 justify-center items-center pb-5">
          {agree ? (
            <button onClick={() => setAgree(!agree)}>
              <Selected />
            </button>
          ) : (
            <button onClick={() => setAgree(!agree)}>
              <Unselected />
            </button>
          )}
          <p className="text-[12px]">
            I have read and agree to the upload guidelines.
          </p>
        </div>
        <button
          onClick={() => handleSubmit()}
          disabled={agree}
          className={`text-[16px] font-semibold ${
            agree
              ? "bg-gradient-to-b from-[#FFB2E0] to-[#CD3EFF] text-white"
              : "bg-[#FFFFFF0A] text-[#444444]"
          }    w-full rounded-[16px] py-3`}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default VideoUpload;
