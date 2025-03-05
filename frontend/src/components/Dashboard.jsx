import React from "react";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-5 flex flex-col min-h-screen">
        <div className="text-lg font-bold mb-5">U-Tad</div>
        <nav className="flex-grow">
          <ul>
            <li className="mb-2 cursor-pointer">Profile</li>
            <li className="mb-2 cursor-pointer">Dashboard</li>
            <li className="mb-2 cursor-pointer">Career Roadmap</li>
          </ul>
        </nav>
        <button className="mt-auto border border-white px-4 py-2">Sign Out</button>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-10">
        {/* Profile Section */}
        <div className="p-6 bg-white shadow rounded flex justify-between items-center relative">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div>
              <div className="w-40 h-4 bg-gray-300 rounded-md"></div>
              <div className="mt-2 w-40 h-2 bg-green-500 rounded-md"></div>
            </div>
          </div>
          {/* Centered Date and Offer Button */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center bg-white p-2 rounded shadow-md">
            <p className="text-black font-semibold">Date</p>
            <button className="mt-2 bg-black text-white px-4 py-2 rounded">Search Similar Offers</button>
          </div>
          {/* Notifications Section */}
          <div className="absolute right-6 top-6 w-48 bg-gray-200 rounded p-4 shadow-md z-20">
            <p className="text-black font-semibold">Notifications</p>
            <div className="mt-2 w-full h-6 bg-white rounded shadow"></div>
          </div>
        </div>
        
        {/* Personal Path */}
        <div className="mt-6 p-6 bg-white shadow rounded">
          <h3 className="font-semibold text-black">Personal Path</h3>
          <div className="relative flex items-center justify-between mt-4">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-black"></div>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="relative flex items-center">
                <div className="w-6 h-6 bg-blue-600 rounded-full relative z-10"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Course Recommendations */}
        <h3 className="mt-6 text-lg font-semibold text-black">Course Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white shadow rounded p-4 flex flex-col justify-between">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-4 bg-blue-600 rounded-md w-full"></div>
            </div>
          ))}
        </div>
        
        {/* Your Courses */}
        <h3 className="mt-6 text-lg font-semibold text-black">Your Courses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {[0, 0].map((value, i) => (
            <div key={i} className="h-32 bg-white shadow rounded p-4 flex flex-col justify-between">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-400 rounded-md w-full text-center text-black font-bold">{value}%</div>
            </div>
          ))}
        </div>
        
        {/* Internships Near You */}
        <h3 className="mt-6 text-lg font-semibold text-black">Internships Near You</h3>
        <div className="mt-2 p-4 bg-white shadow rounded flex">
          <div className="w-1/3 flex flex-col gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="w-2/3 h-64 bg-gray-300 flex items-center justify-center text-black font-semibold">Map placeholder</div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
