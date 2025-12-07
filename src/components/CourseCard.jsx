import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  const mrp = 4299;
  const offerPrice = course.offerPrice || 3499;

  const discountPercent = Math.round(((mrp - offerPrice) / mrp) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-200 p-5 relative">

      {/* SALE Badge */}
      <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
        {discountPercent}% OFF
      </div>

      {/* Thumbnail */}
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-40 object-cover rounded-xl mb-4"
        />
      </div>

      {/* Title */}
      <h2 className="text-[20px] font-bold text-gray-900 line-clamp-2">
        {course.title}
      </h2>

      {/* Category */}
      <p className="text-sm text-purple-600 font-semibold mt-1">
        {course.category}
      </p>

      {/* Short Description */}
      <p className="text-gray-600 text-sm mt-2 line-clamp-3">
        {course.shortDescription}
      </p>

      {/* Course Stats */}
      <div className="flex justify-between text-sm text-gray-700 mt-4">
        <span>⏳ {course.duration}</span>
        <span>🎥 {course.totalLectures} Lectures</span>
      </div>

      {/* PRICE Section */}
      <div className="mt-4">
        <p className="text-gray-500 line-through text-sm">Actual Price: ₹{mrp}</p>

        <p className="text-[22px] font-extrabold text-green-700 leading-tight">
          Offer Price: ₹{offerPrice}
        </p>

        <p className="text-xs text-green-600 font-medium mt-1">
          Limited Time Offer! Save ₹{mrp - offerPrice} Today
        </p>
      </div>

      {/* Explore Button */}
      <Link
        to={`/course/${course._id}`}
        className="mt-5 block text-center px-6 py-2 rounded-full bg-blue-900 text-white font-semibold hover:bg-blue-800 transition-all"
      >
        Explore Course →
      </Link>
    </div>
  );
};

export default CourseCard;
