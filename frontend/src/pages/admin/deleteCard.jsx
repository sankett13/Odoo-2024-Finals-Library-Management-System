import React from 'react';

const Deletecard = ({ isbn, name, handleDelete }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-4 mb-2 border rounded-lg shadow-sm bg-white">
      <div className="flex-grow">
        <h3 className="text-lg font-bold text-[#5D3891]">{name}</h3>
        <p className="text-sm text-[#333333]">ISBN: {isbn}</p>
      </div>
      <div className="flex-grow">
        <h3 className="text-lg font-bold text-[#5D3891]">{name}</h3>
        <p className="text-sm text-[#333333]">Name: {name}</p>
      </div>
      <button
        onClick={() => handleDelete(isbn)}
        className="bg-[#F99417] hover:bg-[#E8E2E2] text-white font-bold py-2 px-4 rounded transition duration-200 mt-4 md:mt-0"
      >
        Delete
      </button>
    </div>
  );
};

export default Deletecard;