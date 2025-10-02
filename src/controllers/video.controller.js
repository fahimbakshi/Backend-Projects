import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHamdler.js"
import { uploadOnCloudnary } from "../utils/cloudnary.js"



const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    
     // Ensure numbers
    page = parseInt(page);
    limit = parseInt(limit);

    // Build filter object
    const filter = {};
    if (query) {
        filter.title = { $regex: query, $options: "i" }; // case-insensitive search on title
    }
    if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new ApiError(400, "Invalid userId");
        }
        filter.owner = userId;
    }

    // Sorting object
    const sortOptions = {};
    sortOptions[sortBy] = sortType === "asc" ? 1 : -1;

    // Pagination
    const skip = (page - 1) * limit;

    // Fetch videos
    const videos = await Video.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate("owner", "username fullName avatar"); // populate owner details if needed

    // Count total for pagination
    const totalVideos = await Video.countDocuments(filter);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                videos,
                pagination: {
                    total: totalVideos,
                    page,
                    limit,
                    totalPages: Math.ceil(totalVideos / limit),
                },
            },
            "Videos fetched successfully"
        )
    );
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title?.trim() || !description?.trim()) {
    throw new ApiError(400, "Title and description are required");
  }

  const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!videoFileLocalPath) {
    throw new ApiError(400, "Video file is required");
  }
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is required");
  }

  const videoFile = await uploadOnCloudnary(videoFileLocalPath);
  const thumbnail = await uploadOnCloudnary(thumbnailLocalPath);

  if (!videoFile) {
    throw new ApiError(500, "Video file upload failed");
  }
  if (!thumbnail) {
    throw new ApiError(500, "Thumbnail upload failed");
  }

  const video = await Video.create({
    title: title.trim(),
    description: description.trim(),
    duration: videoFile.duration || 0,
    videoFile: videoFile.secure_url, // ✅ use secure_url
    thumbnail: thumbnail.secure_url,
    views: 0,
    owner: req.user?._id,
    isPublished: true,
  });

  if (!video) {
    throw new ApiError(500, "Video upload failed please try again");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video uploaded successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
        // Validate videoId
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId")
    }
    
    // Find video with owner details
    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "channel",
                            as: "subscribers"
                        }
                    },
                    {
                        $addFields: {
                            subscribersCount: {
                                $size: "$subscribers"
                            },
                            isSubscribed: {
                                $cond: {
                                    if: {
                                        $in: [
                                            req.user?._id,
                                            "$subscribers.subscriber"
                                        ]
                                    },
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            username: 1,
                            "avatar.url": 1,
                            subscribersCount: 1,
                            isSubscribed: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likes"
                },
                owner: {
                    $first: "$owner"
                },
                isLiked: {
                    $cond: {
                        if: {$in: [req.user?._id, "$likes.likedBy"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                "videoFile": 1, // Ensure we are fetching the videoFile field
                "thumbnail": 1,
                title: 1,
                description: 1,
                views: 1,
                createdAt: 1,
                duration: 1,
                owner: 1,
                likesCount: 1,
                isLiked: 1
            }
        }
    ])
    
    if (!video?.length) {
        throw new ApiError(404, "Video does not exist")
    }
    
    // Increment views if user is authenticated and is not the owner
    const videoDoc = await Video.findById(videoId);
    if (req.user && videoDoc.owner.toString() !== req.user._id.toString()) {
        videoDoc.views += 1;
        await videoDoc.save({ validateBeforeSave: false });
    }
    
    return res
        .status(200)
        .json(new ApiResponse(200, video[0], "Video details fetched successfully"))
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const { title, description } = req.body;
    const thumbnailLocalPath = req.file?.path;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "No video found");
    }

    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You can't edit this video as you are not the owner");
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;

    if (thumbnailLocalPath) {
        const oldThumbnailUrl = video.thumbnail;
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
        if (!thumbnail.secure_url) {
            throw new ApiError(400, "Error while uploading thumbnail");
        }
        // --- CRITICAL FIX ---
        updateData.thumbnail = thumbnail.secure_url;
        
        // Delete old thumbnail after updating the document
        if (oldThumbnailUrl) {
            try {
                await deleteFromCloudinary(oldThumbnailUrl);
            } catch (error) {
                console.error("Failed to delete old thumbnail:", error);
            }
        }
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $set: updateData },
        { new: true }
    );

    if (!updatedVideo) {
        throw new ApiError(500, "Failed to update video details");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedVideo, "Video details updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
     // Validate videoId
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  // Find the video
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Check ownership
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to delete this video"); //403 is semantically more correct here (user is authenticated but not authorized).
  }

  // Delete video file from Cloudinary
  if (video.videoFile) {
    try {
      await deleteFromCloudinary(video.videoFile, "video"); // pass resource type
      console.log("Video file deleted from Cloudinary");
    } catch (error) {
      console.error("Failed to delete video file:", error);
    }
  }

  // Delete thumbnail from Cloudinary
  if (video.thumbnail) {
    try {
      await deleteFromCloudinary(video.thumbnail, "image"); // pass resource type
      console.log("Thumbnail deleted from Cloudinary");
    } catch (error) {
      console.error("Failed to delete thumbnail:", error);
    }
  }

  // Delete video from DB
  await Video.findByIdAndDelete(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  // Find video
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Ownership check
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to toggle this video");
  }

  // Toggle publish status
  video.isPublished = !video.isPublished;
  await video.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isPublished: video.isPublished },
        `Video is now ${video.isPublished ? "published" : "unpublished"}`
      )
    );
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}