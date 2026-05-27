import React, { useState } from "react";
import GuestDetail from "./GuestDetail/GuestDetail";

const GuestInfo = ({ adultCount, childCount, guests, setGuests, firstPassengerName }) => {

  //Tạo một cái hàm để cập nhật thêm thông tin hành khách mới vào danh sách trên
  const handleGuestChange = (index, data) => {
    setGuests((prev) => {
      const newGuests = [...prev];
      newGuests[index] = data;
      return newGuests;
    });
  };

  return (
    <div id="guest-info">
      <h2 className="text-2xl my-5 font-bold">Thông Tin Hành Khách</h2>
      {[...Array(adultCount)].map((_, index) => (
        <GuestDetail
          key={`adult-${index}`}
          type={`Người lớn ${index + 1}`}
          onChange={(data) => handleGuestChange(index, data)}
          defaultName={index === 0 ? firstPassengerName : ""}
        />
      ))}

      {[...Array(childCount)].map((_, index) => (
        <GuestDetail
          key={`child-${index}`}
          type={`Trẻ em ${index + 1}`}
          onChange={(data) => handleGuestChange(adultCount + index, data)}
        />
      ))}
    </div>
  );
};

export default GuestInfo;
