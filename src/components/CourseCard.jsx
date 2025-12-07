import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-200 p-5 relative">

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
