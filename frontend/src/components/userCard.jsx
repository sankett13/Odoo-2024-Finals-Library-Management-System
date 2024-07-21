import React from 'react';

const Usercard = ({ username, email }) => {
  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <div className="flex justify-center mt-8">
          <img
            className="w-32 h-32 object-cover rounded-full border-4 border-purple-500"
            src="https://www.shareicon.net/download/2016/05/24/770136_man_512x512.png" 
            alt="User Avatar"
          />
        </div>
        <div className="text-center mt-2">
          <h2 className="text-xl font-bold text-purple-900">{username}</h2>
          <p className="text-gray-600">YourCompany</p>
        </div>
        <div className="text-center mt-2">
          <p className="text-gray-600">✉️ {email}</p>
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-100 border-t border-gray-200">
        <h3 className="text-lg font-bold text-purple-900">Your contact</h3>
        <p className="text-gray-700 mt-2">{username}</p>
        <p className="text-gray-700">✉️ {email}</p>
      </div>
    </div>
  );
};

export default Usercard;
