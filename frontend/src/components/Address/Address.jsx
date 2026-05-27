import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faCalendar } from "@fortawesome/free-solid-svg-icons";

const addressDetail = [
  {
    id: 1,
    office: "Văn phòng HCM",
    place: "677 Trần Hưng Đạo, Phường Chợ Quán, Thành phố Hồ Chí Minh",
    timework:
      "Từ thứ hai - Sáng thứ 7 (Sáng 8:00 - 11:30 - Chiều 13:30 - 17:30)",
  },
  {
    id: 2,
    office: "Văn phòng Hà Nội",
    place: "22 Mai Anh Tuấn, Phường Ô Chợ Dừa, Thành phố Hà Nội",
    timework:
      "Từ thứ hai - Sáng thứ 7 (Sáng 8:00 - 11:30 - Chiều 13:30 - 17:30)",
  },
  {
    id: 3,
    office: "Văn phòng Cần Thơ",
    place: "09 Cách Mạng Tháng Tám, Phường Ninh Kiều, Thành phố Cần Thơ",
    timework:
      "Từ thứ hai - Sáng thứ 7 (Sáng 8:00 - 11:30 - Chiều 13:30 - 17:30)",
  },
  {
    id: 4,
    office: "Văn phòng Đà Nẵng",
    place: "291 Đống Đa, Phường Hải Châu, Thành phố Đà Nẵng",
    timework:
      "Từ thứ hai - Sáng thứ 7 (Sáng 8:00 - 11:30 - Chiều 13:30 - 17:30)",
  },
];

const Address = () => {
  return (
    <div>
      <p className="text-sm mb-3">Thanh toán trực tiếp tại</p>
      <div className="grid grid-cols-2 gap-4">
        {addressDetail &&
          addressDetail.map((option) => (
            <div key={option.id}>
              <p className="text-xs font-semibold mb-2">{option.office}</p>
              <div className="flex items-center space-x-1 mb-2">
                <FontAwesomeIcon icon={faLocationDot} />
                <p className="text-xs">{option.place}</p>
              </div>
              <div className="flex items-center space-x-1">
                <FontAwesomeIcon icon={faCalendar} />
                <p className="text-xs">{option.timework}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Address;
