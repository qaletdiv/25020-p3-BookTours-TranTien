import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";

const sortOfPrice = ["Giá thấp → cao", "Giá cao → thấp"];

const Sortof = ({ handleSort }) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleSelect = (value) => {
    handleSort(value)
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="relative" ref={dropdownRef}>
      <div className="pr-4">
        <p
          className="text-[#013879] text-lg font-semibold select-none"
          onClick={toggleDropdown}
        >
          <FontAwesomeIcon
            icon={faSort}
            className={`text-xl transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
          Sắp xếp theo
        </p>
      </div>
      <div>
        {/* DANH SÁCH TÙY CHỌN (DROPDOWN MENU) */}
        <div
          id="dropdown-menu"
          className={`
          absolute w-full p-3 mt-1 h-auto
          bg-white 
          border border-gray-200 
          shadow-lg 
          z-10
          overflow-auto
          ${isOpen ? "block" : "hidden"}
        `}
        >
          {/* Các tùy chọn lọc giá */}
          <div
            onClick={() => handleSelect("asc")}
            className="p-1 cursor-pointer transition duration-100 active:text-red-500 text-black hover:bg-gray-100 text-sm select-none"
          >
            Giá thấp → cao
          </div>
          <div
            onClick={() => handleSelect("desc")}
            className="p-1 cursor-pointer transition duration-100 active:text-red-500 text-black hover:bg-gray-100 text-sm select-none"
          >
            Giá cao → thấp
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sortof;
