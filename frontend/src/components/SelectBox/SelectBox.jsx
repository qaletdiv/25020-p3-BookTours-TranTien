import React, { useState, useRef, useEffect } from "react";

const SelectBox = ({ title, title2, departure, destination, options }) => {
  // 1. Quản lý trạng thái: mở/đóng menu. 
  const [isOpen, setIsOpen] = useState(false);
  // 2. Quản lý trạng thái: giá trị được chọn
  const [selectedValue, setSelectedValue] = useState(title2);

  const dropdownRef = useRef(null); 

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); 

  // Xử lý khi chọn một tùy chọn
  const handleSelect = (value) => {
    setSelectedValue(value); 
    setIsOpen(false); 
  };

  // Xử lý khi click vào khung chọn để chuyển đổi trạng thái mở/đóng
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {/* TIÊU ĐỀ */}
      <h3 className="text-lg font-bold text-[#013879] mb-2">{title}</h3>

      {/* KHUNG CHỌN (SELECT BOX) */}
      <div
        id="select-box"
        onClick={toggleDropdown} 
        className={`
          p-3
          bg-gray-50 
          border border-gray-200 
          cursor-pointer 
          flex justify-between items-center
          font-medium
          transition duration-150
          ${
            isOpen
              ? "border-[#013879] text-[#013879] shadow-md"
              : "text-[#013879] hover:border-blue-400"
          }
        `}
        //Nếu có vùng chọn
      >
        <span>{selectedValue}</span>
        {/* Icon mũi tên xoay khi mở/đóng */}
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </div>

      {/* DANH SÁCH TÙY CHỌN (DROPDOWN MENU) */}
      <div
        id="dropdown-menu"
        className={`
          absolute w-full mt-1 h-auto max-h-[400px]
          bg-white 
          border border-gray-200 
          shadow-lg 
          z-10
          overflow-auto
          ${isOpen ? "block" : "hidden"}
        `}
      >
        {/* Tùy chọn mặc định/đã chọn */}
        <div
          className={`
            p-3 
            cursor-default 
            ${
              selectedValue === title2
                ? "bg-[#013879] text-white"
                : "text-[#013879]"
            }
          `}
        >
          {title2}
        </div>

        {/* Các tùy chọn khác */}
        {options.map((option) => (
          <div
            key={option}
            onClick={() => {
              handleSelect(option);

              if (departure) {
                departure(option);
              }

              if (destination) {
                destination(option);
              }
            }}
            className={`
              p-3 
              cursor-pointer 
              transition duration-100
              ${
                selectedValue === option
                  ? "bg-[#013879] text-white"
                  : "text-[#013879] hover:bg-gray-100"
              }
            `}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectBox;
