import React, { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import AWS from "aws-sdk"; // Use AWS SDK v2
import UploadForm from "@/components/create-center/upload-form";
import toast from "react-hot-toast";
import { decryptImage } from "@/utils/image-decrypt";
import {
  useCreatePostsMutation,
  useGetConfigQuery,
  useGetS3Query,
} from "@/store/api/createCenterApi";
import TopNav from "@/components/create-center/top-nav";
import UploadProgress from "@/components/create-center/upload-progress";
import DeleteDetail from "@/components/create-center/delete-detail";

const UploadVideos = ({ editPost, seteditPost, refetch }: any) => {
  // console.log(editPost?.files[0]?.image_url, "editpost");
  // const { data: configData } = useGetConfigQuery({});
  const domain = editPost?.files[0]?.image_url;
  const { data } = useGetS3Query({});
  const [files, setFiles] = useState(editPost?.files || []);
  const [thumbnail, setThumbnail] = useState(editPost?.preview_image || null);
  const [uploading, setUploading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [agree, setAgree] = useState(editPost ? true : false);
  console.log(editPost, "ed post");
  const [videoDuration, setVideoDuration] = useState(
    editPost?.files[0].duration || 0
  );
  const resData = data?.data;
  const [videoWidth, setVideoWidth] = useState(editPost?.files[0].width || 0);
  const [videoHeight, setVideoHeight] = useState(
    editPost?.files[0].height || 0
  );
  const videoUrlRef = useRef(editPost?.files[0].resourceURL || null);
  console.log(videoUrlRef, "ref");
  const [uploadedSize, setUploadedSize] = useState(0); // Added
  const [totalSize, setTotalSize] = useState(
    (editPost?.files[0].size / (1024 * 1024)).toFixed(2) || 0
  ); // Added
  const abortController = useRef<any>(null); // Added
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [successEnd, setsuccessEnd] = useState(false);

  const [createPosts, { isLoading }] = useCreatePostsMutation(); // Use the mutation hook

  useEffect(() => {
    const decryptThumbnail = async () => {
      if (editPost?.preview_image && editPost.preview_image.endsWith(".txt")) {
        try {
          const decryptedImage = await decryptImage(editPost.preview_image);
          setThumbnail(decryptedImage);
        } catch (error) {
          console.error("Error decrypting preview image:", error);
          setThumbnail(editPost.preview_image); // Fallback to the original URL
        }
      } else {
        if (editPost) setThumbnail(`${domain}/${editPost?.preview_image}`);
      }
    };

    decryptThumbnail();
  }, [editPost]);

  // Handle video file drop
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const videoFile = acceptedFiles.find((file) =>
      file.type.startsWith("video/")
    );

    if (!videoFile) {
      toast.error("请选择一个有效的视频文件。", {
        // Please select a valid video file.
        style: {
          background: "#25212a",
          color: "white",
        },
      });
      return;
    }

    if (acceptedFiles.length > 1) {
      toast.error("你只能上传一个视频。", {
        // You can only upload one video.
        style: {
          background: "#25212a",
          color: "white",
        },
      });
      return;
    }
    
    // Check file size - 100MB limit (100 * 1024 * 1024 bytes)
    if (videoFile.size > 100 * 1024 * 1024) {
      toast.error("视频大小不能超过100MB。", {
        // Video size cannot exceed 100MB.
        style: {
          background: "#25212a",
          color: "white",
        },
      });
      return;
    }

    try {
      // Generate thumbnail for the video
      const generatedThumbnail = await generateThumbnail(videoFile);
      setThumbnail(generatedThumbnail);

      // Create a video element to extract metadata
      const video = document.createElement("video");
      video.src = URL.createObjectURL(videoFile);

      // Add muted attribute to allow autoplay on iOS
      video.muted = true;

      // Add a promise to handle iOS autoplay restrictions
      const metadataPromise = new Promise<void>((resolve) => {
        video.onloadedmetadata = async () => {
          try {
            // Try to play the video briefly to ensure metadata is loaded on iOS
            await video.play().catch(() => {
              console.log("Play prevented, but metadata should be loaded");
            });

            // Pause immediately after starting playback
            video.pause();

            setVideoDuration(video.duration || 0); // Set duration
            setVideoWidth(video.videoWidth || 0); // Set width
            setVideoHeight(video.videoHeight || 0); // Set height
            resolve();
          } catch (error: unknown) {
            console.error("Error loading video metadata:", error);
            // Set default values if metadata extraction fails
            setVideoDuration(0);
            setVideoWidth(0);
            setVideoHeight(0);
            resolve();
          }
        };

        // Handle errors
        video.onerror = () => {
          console.error("Error loading video:", video.error);
          // Set default values if metadata extraction fails
          setVideoDuration(0);
          setVideoWidth(0);
          setVideoHeight(0);
          resolve();
        };
      });

      // Wait for metadata to be loaded
      await metadataPromise;

      // Add video to files state
      setFiles([
        {
          video: videoFile,
          size: videoFile.size,
          type: "video",
        },
      ]);
      setTotalSize((videoFile.size / (1024 * 1024)).toFixed(2)); // Convert to MB

      if (videoUrlRef.current) {
        URL.revokeObjectURL(videoUrlRef.current);
      }
      videoUrlRef.current = URL.createObjectURL(videoFile);
    } catch (error: unknown) {
      console.error("Error processing video:", error);
      toast.error("处理视频时出错。请重试。", {
        // Error processing video. Please try again.
        style: {
          background: "#25212a",
          color: "white",
        },
      });
    }
  }, []);

  // Handle thumbnail drop
  const onThumbnailDrop = useCallback((acceptedFiles: any) => {
    const thumbnailImage = acceptedFiles.find((file: any) =>
      file.type.startsWith("image/")
    );

    if (acceptedFiles.length > 1) {
      toast.error("你只能上传一个缩略图图像。", {
        // You can only upload one image for the thumbnail.
        style: {
          background: "#25212a",
          color: "white",
        },
      });
      return;
    }

    if (thumbnailImage) {
      setThumbnail(thumbnailImage);
    } else {
      toast.error("请上传一个有效的缩略图图像。", {
        // Please upload a valid image for the thumbnail.
        style: {
          background: "#25212a",
          color: "white",
        },
      });
    }
  }, []);

  // Generate thumbnail from video
  const generateThumbnail = (videoFile: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");

      // Add attributes to help with iOS playback
      video.muted = true;
      video.playsInline = true;
      video.crossOrigin = "anonymous";

      // Create object URL
      const objectUrl = URL.createObjectURL(videoFile);
      video.src = objectUrl;

      // Set up event handlers
      video.onloadeddata = async () => {
        try {
          // Try to play the video briefly to ensure it's loaded on iOS
          await video.play().catch(() => {
            console.log("Play prevented, but video should be loaded");
          });

          // Seek to the first frame
          video.currentTime = 0;

          // Pause immediately after starting playback
          video.pause();
        } catch (error: unknown) {
          console.error("Error playing video for thumbnail:", error);
        }
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth || 320; // Fallback width if videoWidth is 0
          canvas.height = video.videoHeight || 240; // Fallback height if videoHeight is 0

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            throw new Error("Could not get canvas context");
          }

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const fileName = `${Date.now()}.jpg`; // Generate a unique file name
                const file = new File([blob], fileName, {
                  type: "image/jpeg",
                });

                // Clean up resources
                URL.revokeObjectURL(objectUrl);

                resolve(file); // Resolve with the File object
              } else {
                // If blob creation fails, create a default thumbnail
                createDefaultThumbnail().then(resolve).catch(reject);
              }
            },
            "image/jpeg",
            0.9 // Quality factor for JPEG compression
          );
        } catch (error: unknown) {
          console.error("Error generating thumbnail:", error);
          // If thumbnail generation fails, create a default thumbnail
          createDefaultThumbnail().then(resolve).catch(reject);
        }
      };

      video.onerror = () => {
        console.error("Video error:", video.error);
        // If video loading fails, create a default thumbnail
        createDefaultThumbnail().then(resolve).catch(reject);
      };

      // Set a timeout in case the video never triggers the events
      setTimeout(() => {
        if (video.readyState < 2) {
          // HAVE_CURRENT_DATA
          console.warn("Video loading timeout - creating default thumbnail");
          createDefaultThumbnail().then(resolve).catch(reject);
        }
      }, 5000); // 5 second timeout
    });
  };

  // Create a default thumbnail if video thumbnail generation fails
  const createDefaultThumbnail = async () => {
    // Create a simple colored canvas as a fallback thumbnail
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 240;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Fill with a gradient background
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, "#3498db");
      gradient.addColorStop(1, "#2980b9");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add a play icon
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 + 30, canvas.height / 2);
      ctx.lineTo(canvas.width / 2 - 15, canvas.height / 2 + 25);
      ctx.lineTo(canvas.width / 2 - 15, canvas.height / 2 - 25);
      ctx.closePath();
      ctx.fill();
    }

    return new Promise<File>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const fileName = `default_thumbnail_${Date.now()}.jpg`;
            const file = new File([blob], fileName, {
              type: "image/jpeg",
            });
            resolve(file);
          } else {
            reject(new Error("Failed to create default thumbnail"));
          }
        },
        "image/jpeg",
        0.9
      );
    });
  };

  // Dropzone for video upload
  const { getRootProps, getInputProps, open } = useDropzone({
    accept: { "video/*": [] },
    onDrop,
    noClick: true, // Disable click behavior to fix iOS issues
  });

  // Dropzone for thumbnail upload
  const {
    getRootProps: getThumbnailRootProps,
    getInputProps: getThumbnailInputProps,
    open: openThumbnailDialog,
  } = useDropzone({
    accept: { "image/*": [] },
    onDrop: onThumbnailDrop,
    noClick: true, // Disable click behavior to fix iOS issues
  });

  const bucket = resData?.bucket;
  // const base_url = resData?.base_url; // Commented out as it's not used
  const region = resData?.region;
  const accessKeyId = resData?.credentials?.accessKeyId;
  const secretAccessKey = resData?.credentials?.secretAccessKey;
  const sessionToken = resData?.credentials?.sessionToken;
  const directory = resData?.uploadPath;

  // Handle form submission from VideoUploadForm
  const handleFormSubmit = async (formData: {
    contentTitle: string;
    hashtags: string[];
    privacy: string;
    setContentTitle: (value: string) => void;
    setHashtags: (value: string[]) => void;
  }) => {
    if (files.length === 0) {
      toast.error("请上传一个视频。", {
        // Please upload a video.
        style: {
          background: "#25212a",
          color: "white",
        },
      });

      return;
    }

    if (!thumbnail) {
      toast.error("请上传一个缩略图。", {
        // Please upload a thumbnail.
        style: {
          background: "#25212a",
          color: "white",
        },
      });
      return;
    }

    if (files[0]?.resourceURL && typeof thumbnail === "string") {
      setUploading(false);
    } else {
      setUploading(true);
    }

    setUploadPercentage(0);
    setUploadedSize(0);
    setsuccessEnd(false);

    abortController.current = new AbortController(); // Create abort controller

    try {
      // Initialize S3 client (AWS SDK v2)
      const s3 = new AWS.S3({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey,
          sessionToken,
        },
      });

      const uploadFileToS3 = async (file: any, key: any, contentType: any) => {
        const uploadParams = {
          Bucket: bucket,
          Key: `${directory}/${key}`,
          Body: file,
          ContentType: contentType,
          ContentDisposition: "inline",
        };

        return new Promise((resolve, reject) => {
          const upload = s3.upload(uploadParams);

          upload.on("httpUploadProgress", (progress) => {
            const uploadedMB: any = (progress.loaded / (1024 * 1024)).toFixed(
              2
            );
            setUploadPercentage(
              Math.round((progress.loaded / progress.total) * 100)
            );
            setUploadedSize(uploadedMB);
          });

          upload.send((err, data) => {
            if (err) reject(err);
            else resolve(data);
          });

          abortController.current.signal.addEventListener("abort", () => {
            upload.abort();
            reject(new Error("Upload aborted"));
          });
        });
      };
      let thumbnailUrl;
      let videoUrl;
      let thumbnailKey;
      let videoKey;
      const videoFile = files[0].video;

      if (!files[0].resourceURL) {
        // Upload video file

        videoKey = `video_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}.${videoFile.name.split(".").pop()}`;
        await uploadFileToS3(videoFile, videoKey, videoFile.type);
        videoUrl = `${directory}/${videoKey}`;
      } else {
        videoUrl = files[0].resourceURL;
      }

      if (typeof thumbnail !== "string") {
        // Upload thumbnail file
        thumbnailKey = `thumbnail_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}.${thumbnail.name.split(".").pop()}`;
        await uploadFileToS3(thumbnail, thumbnailKey, thumbnail.type);
        thumbnailUrl = `${directory}/${thumbnailKey}`;
      } else {
        thumbnailUrl = thumbnail;
      }

      // Construct the public URLs for the uploaded files

      // Ensure both video and thumbnail URLs are available before proceeding
      if (!videoUrl || !thumbnailUrl) {
        toast.error("视频上传失败。请重试。", {
          // Failed to upload video. Please try again.
          style: {
            background: "#25212a",
            color: "white",
          },
        });
        throw new Error("Failed to generate URLs for uploaded files.");
      }

      // Prepare the payload for the API
      const payload: any = {
        title: formData.contentTitle,
        tags: formData.hashtags,
        description: "", // Optional
        privacy: formData.privacy,
        cover_url: thumbnailUrl,
        files: [
          {
            url: videoUrl,
            format: files[0]?.resourceURL
              ? files[0]?.suffix
              : videoFile.name.split(".").pop(),
            duration: videoDuration, // Use actual duration
            width: videoWidth, // Use actual width
            height: videoHeight, // Use actual height
            size: files[0]?.resourceURL ? files[0]?.size : videoFile.size,
          },
        ],
      };

      if (editPost) {
        payload.update_id = editPost.post_id;
      }

      try {
        await createPosts(payload).unwrap();

        // Show success message
        toast.success("视频上传成功！", {
          // Video uploaded successfully!
          style: {
            background: "#25212a",
            color: "white",
          },
        });
        if (files[0]?.resourceURL && typeof thumbnail === "string") {
          setUploading(false);
          seteditPost(null);
          refetch();
        } else {
          setsuccessEnd(true);
        }
        setFiles([]);
        formData.setContentTitle("");
        formData.setHashtags([]);
        setAgree(false);
        setThumbnail(null);
      } catch (error) {
        setUploading(false);
        setsuccessEnd(false);

        console.error("Upload failed:", error);
        toast.error("视频上传失败。请重试。", {
          // Failed to upload video. Please try again.
          style: {
            background: "#25212a",
            color: "white",
          },
        });
      }

      // Call the createPosts mutation
    } catch (error) {
      setUploading(false);
      setsuccessEnd(false);
      console.error("Upload failed:", error);
      toast.error("视频上传失败。请重试。", {
        // Failed to upload video. Please try again.
        style: {
          background: "#25212a",
          color: "white",
        },
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCancelUpload = () => {
    if (abortController.current) {
      abortController.current.abort();
    }
    setUploading(false);
    setsuccessEnd(false);
    setUploadPercentage(0);
    setUploadedSize(0);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };
  return (
    <div className="relative w-full h-screen">
      {uploading || successEnd ? (
        <div className="fixed top-0 left-0 w-full h-full z-50">
          <UploadProgress
            uploadPercentage={uploadPercentage}
            uploadedSize={uploadedSize}
            totalSize={totalSize}
            onCancel={showModal}
            successEnd={successEnd}
            setsuccessEnd={setsuccessEnd}
            refetch={refetch}
            seteditPost={seteditPost}
          />

          {isModalVisible && (
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm flex justify-center items-center z-50">
              <div className="bg-[#16131C] rounded-md w-[320px] text-center pt-5">
                <p className="text-white modal-text p-5">
                  你的视频仍在上传中。你可以取消上传或稍等片刻，等待上传完成。
                  {/* Your video is still uploading. You can cancel the upload or wait a moment for it to complete. */}
                </p>
                <div className="flex justify-center border-t-[0.5px] border-[#2a262f]">
                  <button
                    onClick={() => setIsModalVisible(false)}
                    className="flex-1 cursor-pointer py-3 border-r-[0.5px] border-[#2a262f]  text-white"
                  >
                    继续
                    {/* Continue */}
                  </button>
                  <button
                    onClick={handleCancelUpload}
                    className="flex-1 py-3 cursor-pointer  text-[#C23033]"
                  >
                    取消上传
                    {/* Cancel Upload */}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
      {editPost ? (
        <TopNav
          left={() => seteditPost(null)}
          center={"编辑视频"}
          right={
            <DeleteDetail
              seteditPost={seteditPost}
              refetch={refetch}
              id={editPost?.post_id}
            />
          }
        />
      ) : (
        <TopNav center={"上传视频"} />
      )}

      <div className="flex items-center justify-center mx-5 gap-3 pt-5">
        <div className="flex flex-col justify-center items-center">
          <div className="preview-container">
            {files?.length > 0 ? (
              <div className="preview-item">
                <video
                  src={
                    editPost
                      ? `${domain}/${videoUrlRef.current}`
                      : videoUrlRef.current
                  }
                  className="preview-video"
                />

                {!uploading && (
                  <button
                    onClick={() => setFiles([])}
                    className="upload-progress1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M6 4.66688L10.0003 0.666562C10.3684 0.29843 10.9653 0.29843 11.3334 0.666562C11.7016 1.03469 11.7016 1.63155 11.3334 1.99969L7.33312 6L11.3334 10.0003C11.7016 10.3684 11.7016 10.9653 11.3334 11.3334C10.9653 11.7016 10.3684 11.7016 10.0003 11.3334L6 7.33312L1.99969 11.3334C1.63155 11.7016 1.03469 11.7016 0.666562 11.3334C0.29843 10.9653 0.29843 10.3684 0.666562 10.0003L4.66688 6L0.666562 1.99969C0.29843 1.63155 0.29843 1.03469 0.666562 0.666562C1.03469 0.29843 1.63155 0.29843 1.99969 0.666562L6 4.66688Z"
                        fill="white"
                        fill-opacity="0.8"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ) : (
              <div {...getRootProps()} className="dropzone" onClick={open}>
                <div className="flex items-center justify-center">
                  <input {...getInputProps()} />
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
                      点击上传视频
                      {/* Click to Upload Video */}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <p className="text-[12px] text-[#888] text-center pt-2">
            视频大小不得超过 <br /> 100MB
            {/* Video size must not exceed 100MB */}
          </p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="preview-container">
            {thumbnail ? (
              <div className="thumbnail-preview">
                <img
                  src={
                    typeof thumbnail === "string"
                      ? thumbnail
                      : URL.createObjectURL(thumbnail)
                  }
                  alt="thumbnail preview"
                  className="preview-image"
                />
                <button
                  onClick={() => setThumbnail(null)}
                  className="upload-progress1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M6 4.66688L10.0003 0.666562C10.3684 0.29843 10.9653 0.29843 11.3334 0.666562C11.7016 1.03469 11.7016 1.63155 11.3334 1.99969L7.33312 6L11.3334 10.0003C11.7016 10.3684 11.7016 10.9653 11.3334 11.3334C10.9653 11.7016 10.3684 11.7016 10.0003 11.3334L6 7.33312L1.99969 11.3334C1.63155 11.7016 1.03469 11.7016 0.666562 11.3334C0.29843 10.9653 0.29843 10.3684 0.666562 10.0003L4.66688 6L0.666562 1.99969C0.29843 1.63155 0.29843 1.03469 0.666562 0.666562C1.03469 0.29843 1.63155 0.29843 1.99969 0.666562L6 4.66688Z"
                      fill="white"
                      fill-opacity="0.8"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div
                {...getThumbnailRootProps()}
                className="dropzone"
                onClick={openThumbnailDialog}
              >
                <div className="flex items-center justify-center">
                  <input {...getThumbnailInputProps()} />
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="36"
                      height="24"
                      viewBox="0 0 36 24"
                      fill="none"
                      className="mt-3"
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
                    <span className="text-[10px] text-[#888] text-center">
                      点击选择图片 <br /> (可选)
                      {/* Click to Upload Cover (optional) */}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <p className="text-[12px] text-[#888] text-center pt-2">
            点击选择图片 <br />
            (可选)
          </p>
        </div>
      </div>
      <div className="">
        <UploadForm
          onFormSubmit={handleFormSubmit}
          uploading={uploading}
          editPost={editPost}
          loading={isLoading}
          agree={agree}
          setAgree={setAgree}
        />
      </div>
    </div>
  );
};

export default UploadVideos;
