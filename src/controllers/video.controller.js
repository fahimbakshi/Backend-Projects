import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHamdler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


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
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}