import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

const PassengerCount = ({
  adultCount,
  childCount,
  setAdultCount,
  setChildCount,
}) => {
  return (
    <div>
      <h2 className="text-2xl my-5 font-bold">Hành Khách</h2>

      {/* 
        Desktop: flex-row + space-x-8
        Mobile: flex-col + space-y-5
      */}
      <div className="flex flex-col space-y-5 md:flex-row md:space-y-0 md:space-x-8 select-none">
        {/* Người lớn */}
        <div className="border-2 px-4 py-5 flex items-center justify-between w-full md:w-1/2">
          <p className="text-sm font-semibold">Người Lớn</p>
          <div className="flex items-center justify-between w-[120px]">
            <div className="w-6 h-6 flex items-center justify-center border-2 border-[#013879] rounded-md">
              <FontAwesomeIcon
                icon={faMinus}
                className="w-3 h-3 text-[#013879]"
                onClick={() =>
                  setAdultCount((pre) => (pre > 1 ? pre - 1 : 1))
                }
              />
            </div>
            <p className="text-2xl text-[#013879] font-medium">
              {adultCount}
            </p>
            <div className="w-6 h-6 flex items-center justify-center border-2 border-[#013879] rounded-md">
              <FontAwesomeIcon
                icon={faPlus}
                className="w-3 h-3 text-[#013879]"
                onClick={() => setAdultCount((pre) => pre + 1)}
              />
            </div>
          </div>
        </div>

        {/* Trẻ em */}
        <div className="border-2 px-4 py-5 flex items-center justify-between w-full md:w-1/2">
          <div>
            <p className="text-sm font-semibold">Trẻ Em</p>
            <p className="text-sm text-gray-400">(2 - 11 tuổi)</p>
          </div>
          <div className="flex items-center justify-between w-[120px]">
            <div className="w-6 h-6 flex items-center justify-center border-2 border-[#013879] rounded-md">
              <FontAwesomeIcon
                icon={faMinus}
                className="w-3 h-3 text-[#013879]"
                onClick={() =>
                  setChildCount((pre) => (pre > 0 ? pre - 1 : 0))
                }
              />
            </div>
            <p className="text-2xl text-[#013879] font-medium">
              {childCount}
            </p>
            <div className="w-6 h-6 flex items-center justify-center border-2 border-[#013879] rounded-md">
              <FontAwesomeIcon
                icon={faPlus}
                className="w-3 h-3 text-[#013879]"
                onClick={() => setChildCount((pre) => pre + 1)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerCount;
