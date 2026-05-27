import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from "react";

const sexOptions = [
  { id: 1, label: "Nam" },
  { id: 2, label: "Nữ" },
];

const GuestDetail = ({ type, onChange, defaultName = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSecond, setIsOpenSecond] = useState(false);
  const [selectedSex, setSelectedSex] = useState(null);
  const [birthDate, SetBirthDate] = useState(null);

  const [guest, setGuest] = useState({
    fullName: defaultName,
    sex: null,
    birthday: null,
  });

  useEffect(() => {
    onChange?.(guest);
  }, [guest]);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsOpenSecond(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (value) => {
    setSelectedSex(value);
    //Thêm thông tin giới tính mới
    setGuest({ ...guest, sex: value });
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const secondToggleDropdown = () => {
    setIsOpenSecond(!isOpenSecond); 
  };

  return (
    <div>
      <p className="text-lg my-5 font-bold">{type}</p>

      <div className="flex flex-col justify-center px-5 py-4 bg-[#f6f8fa]">
        {/* ===== WRAPPER RESPONSIVE ===== */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-5">
          
          {/* Họ Và Tên InPut */}
          <div className="w-full">
            <p className="text-sm font-semibold my-3" required>
              Họ và tên <span className="text-red-500 text-xs">*</span>
            </p>
            <input
              type="text"
              placeholder="Nhập Họ và tên"
              value={guest.fullName}
              onChange={(e) => setGuest({ ...guest, fullName: e.target.value })}
              className="w-full text-xs focus:outline-none px-4 py-5 mb-3"
            />
          </div>

          {/* Giới tính */}
          <div className="w-full lg:w-[300px] relative">
            <p className="text-sm font-semibold my-3" required>
              Giới tính <span className="text-red-500 text-xs">*</span>
            </p>
            <div
              ref={dropdownRef}
              className="px-4 py-5 bg-white text-xs flex items-center justify-between space-x-2 w-full mb-3"
              onClick={toggleDropdown}
            >
              <p className={selectedSex ? "opacity-100" : "opacity-50"}>
                {guest.sex ? guest.sex.label : "Giới tính"}
              </p>
              <FontAwesomeIcon icon={faAngleDown} className="text-[#013879]" />
            </div>

            {/* DANH SÁCH TÙY CHỌN (DROPDOWN MENU) */}
            <div
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
              {sexOptions.map((sex) => (
                <div
                  key={sex.id}
                  onMouseDown={() => handleSelect(sex)}
                  className={`
                    p-3 
                    cursor-pointer 
                    transition duration-100
                    flex items-center space-x-2
                    ${
                      selectedSex === sex
                        ? "bg-[#013879] text-white"
                        : "text-[#013879] hover:bg-gray-100"
                    }
                  `}
                >
                  <p>{sex.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ngày sinh */}
          <div ref={dropdownRef} className="w-full relative">
            <p className="text-sm font-semibold my-3" required>
              Ngày sinh <span className="text-red-500 text-xs">*</span>
            </p>
            <div
              className="px-4 py-5 bg-white text-xs flex items-center justify-between space-x-2 w-full mb-3"
              onClick={secondToggleDropdown}
            >
              <p className={birthDate ? "opacity-100" : "opacity-50"}>
                {guest.birthday
                  ? guest.birthday.toLocaleDateString("vi-VN")
                  : "dd/mm/yyyy"}
              </p>
              <FontAwesomeIcon
                icon={faCalendarDays}
                className="text-[#013879] w-4 h-4"
              />
            </div>

            {/* DANH SÁCH TÙY CHỌN (DROPDOWN MENU) */}
            <div
              className={`
                absolute mt-1 h-[316px]
                bg-white 
                border border-gray-200 
                shadow-lg 
                z-10
                overflow-hidden
                ${isOpenSecond ? "block" : "hidden"}
              `}
            >
              <DatePicker
                selected={birthDate}
                onChange={(date) => {
                  SetBirthDate(date);
                  setGuest({ ...guest, birthday: date });
                  setIsOpenSecond(false); 
                }}
                inline
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                className="border p-2 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestDetail;
