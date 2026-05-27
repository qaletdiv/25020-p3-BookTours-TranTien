import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

export default function Confirm() {
  const navigate  = useNavigate();
  const newOrder  = useSelector((s) => s.orders.currentNewOrder);

  if (!newOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Không tìm thấy đơn hàng</p>
          <button onClick={() => navigate("/tour-du-lich")} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Xem Tour
          </button>
        </div>
      </div>
    );
  }

  const { order, orderByUser, guests, Total } = newOrder;
  const tourName = order?.tour?.title || orderByUser?.productName || "-";
  const departure = order?.variant?.start_date || orderByUser?.departureDate || "-";
  const passengerCount = guests?.length || (order ? order.adult_count + order.child_count : 0);
  const total = Total || order?.total_price || 0;

  const formatDate = (d) => {
    if (!d) return "-";
    return d.includes("-") ? d.split("-").reverse().join("/") : d;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-md p-6 sm:p-8 max-w-md w-full text-center space-y-4">
        <div className="text-5xl animate-bounce">
          <FontAwesomeIcon icon={faCircleCheck} color="#22c55e" />
        </div>

        <h1 className="text-2xl font-semibold text-gray-800">Đặt tour thành công!</h1>

        <p className="text-gray-600 text-sm sm:text-base">
          Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của chúng tôi. Nhân viên sẽ liên hệ xác nhận trong thời gian sớm nhất.
        </p>

        <div className="bg-gray-50 border p-3 sm:p-4 text-sm text-left space-y-2 rounded">
          <p><strong>Tên tour:</strong> {tourName}</p>
          <p><strong>Ngày khởi hành:</strong> {formatDate(departure)}</p>
          <p><strong>Số khách:</strong> {passengerCount} người</p>
          <p><strong>Phương thức thanh toán:</strong> {order?.payment_method || newOrder?.selectedPayment || "-"}</p>
          <p className="text-red-500 font-semibold text-base">
            Tổng cộng: {parseInt(total).toLocaleString("vi-VN")} VNĐ
          </p>
          {order?.id && (
            <p className="text-gray-400 text-xs">Mã đơn hàng: #{order.id}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button onClick={() => navigate("/")} className="flex-1 bg-blue-600 text-white py-2 hover:bg-blue-700 transition">
            Về trang chủ
          </button>
          <button onClick={() => navigate("/info")} className="flex-1 border border-gray-300 py-2 hover:bg-gray-100 transition">
            Lịch sử đặt tour
          </button>
        </div>
      </div>
    </div>
  );
}
