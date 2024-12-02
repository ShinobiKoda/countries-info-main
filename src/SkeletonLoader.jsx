import React from "react";

const SkeletonLoader = () => {
  // Return the skeleton structure
  return (
    <div className="shadow-md rounded-md h-full dark:bg-[#2b3743] bg-white cursor-pointer">
      <div className="h-40 w-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
      <div className="px-6 py-8">
        <div className="h-6 w-2/3 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse mb-4"></div>
        <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse mb-2"></div>
        <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse mb-2"></div>
        <div className="h-4 w-1/4 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
