import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTicket, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const PayBox = ({ orderByUser, adultCount, childCount, Total, handleCart }) => {
  console.log("orderByUser", orderByUser);

  return (
    <div className="w-full h-auto">
      <p className="text-sm">
        <FontAwesomeIcon icon={faTicket} className="text-sm" /> Mã tour:{" "}
        <span className="font-semibold">BUITRANTIEN</span>
      </p>
      <p className="text-xl font-semibold leading-5 my-6">
        {orderByUser.productName || ""}
      </p>
      <div className="flex items-center space-x-2">
        <p className="text-sm">
          {orderByUser?.departureDate?.split("-").reverse().join("/") || ""}
        </p>
        <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
        <p className="text-sm">
          {orderByUser?.returnDate?.split("-").reverse().join("/") || ""}
        </p>
      </div>
      <div className="bg-gray-200 w-full h-[2px] my-3"></div>
      <div className="py-5">
        <div className="py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm">Người Lớn:</p>
            <p className="text-sm font-semibold">
              {orderByUser && adultCount > 0
                ? `${adultCount} x ${(orderByUser.price || 0).toLocaleString(
                    "vi-VN"
                  )}`
                : "0"}{" "}
              VNĐ
            </p>
          </div>
        </div>
        <div className="py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm">Trẻ em:</p>
            <p className="text-sm font-semibold">
              {orderByUser && childCount > 0
                ? `${childCount} x ${(
                    orderByUser.price * 0.8 || 0
                  ).toLocaleString("vi-VN")}`
                : "0"}{" "}
              VNĐ
            </p>
          </div>
        </div>
      </div>
      <div className="py-2">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-red-600">Tổng cộng:</p>
          <p className="text-lg font-semibold text-red-600">
            {orderByUser && Total > 0
              ? (Total || 0).toLocaleString("vi-VN")
              : "0"}{" "}
            VNĐ
          </p>
        </div>
      </div>
      <div className="text-center">
        <button className="button w-full mt-4" onClick={handleCart}>
          Đặt Ngay
        </button>
      </div>
    </div>
  );
};

export default PayBox;
