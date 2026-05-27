import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle, faEnvelope, faPhone,
  faArrowRightFromBracket, faMapMarkedAlt,
  faClock, faCheckCircle, faTimesCircle, faCamera
} from "@fortawesome/free-solid-svg-icons";
import { logout, updateAvatar } from "../../redux/slices/authSlice";
import { fetchUserOrders } from "../../redux/slices/orderSlice";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:3000";

const STATUS_MAP = {
  pending:   { label: "Chờ xác nhận", color: "text-yellow-600 bg-yellow-100", icon: faClock },
  confirmed: { label: "Đã xác nhận",  color: "text-green-600 bg-green-100",  icon: faCheckCircle },
  cancelled: { label: "Đã hủy",       color: "text-red-600 bg-red-100",      icon: faTimesCircle },
};

const UserInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const userStr    = useSelector((s) => s.auth.user);
  const orders     = useSelector((s) => s.orders.orders);
  const loading    = useSelector((s) => s.orders.loading);
  const userInfo   = userStr ? JSON.parse(userStr) : null;
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/dang-nhap");
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("avatar", file);
    setUploading(true);
    try {
      await dispatch(updateAvatar(fd)).unwrap();
    } catch (err) {
      alert(err || "Cập nhật ảnh thất bại");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (!userInfo) return null;

  const avatarSrc = userInfo.avatar ? `${API_BASE}${userInfo.avatar}` : null;
  const formatPrice = (p) => parseInt(p || 0).toLocaleString("vi-VN") + " VNĐ";
  const formatDate  = (d) => d ? new Date(d).toLocaleDateString("vi-VN") : "-";

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-white shadow-md p-6">
          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <div className="relative w-24 h-24 group">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt="avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#013879]"
                />
              ) : (
                <FontAwesomeIcon icon={faUserCircle} className="text-8xl text-[#013879]" />
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 bg-[#013879] text-white rounded-full w-7 h-7 flex items-center justify-center
                           hover:bg-blue-700 transition disabled:opacity-50"
                title="Đổi ảnh đại diện"
              >
                {uploading
                  ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <FontAwesomeIcon icon={faCamera} className="text-xs" />
                }
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          <h2 className="text-center text-2xl font-bold text-[#013879] mb-6">Thông Tin Tài Khoản</h2>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faUserCircle} className="text-[#013879]" />
              <span className="font-semibold w-28">Tên đăng nhập:</span>
              <span>{userInfo.username}</span>
            </div>
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faEnvelope} className="text-[#013879]" />
              <span className="font-semibold w-28">Email:</span>
              <span className="break-all">{userInfo.email}</span>
            </div>
            {userInfo.phone && (
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faPhone} className="text-[#013879]" />
                <span className="font-semibold w-28">Số điện thoại:</span>
                <span>{userInfo.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faUserCircle} className="text-[#013879]" />
              <span className="font-semibold w-28">Vai trò:</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                userInfo.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"
              }`}>
                {userInfo.role}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-2 border border-[#013879] text-[#013879] font-semibold hover:bg-[#013879] hover:text-white transition"
            >
              Về trang chủ
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 py-2 bg-red-500 text-white font-semibold hover:bg-red-600 transition flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faArrowRightFromBracket} /> Đăng xuất
            </button>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white shadow-md p-6">
          <h3 className="text-xl font-bold text-[#013879] mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faMapMarkedAlt} /> Lịch Sử Đặt Tour
          </h3>

          {loading && (
            <div className="flex justify-center py-6">
              <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && orders.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">Bạn chưa đặt tour nào</p>
              <button onClick={() => navigate("/tour-du-lich")} className="mt-3 text-blue-600 hover:underline text-sm">
                Khám phá tour ngay
              </button>
            </div>
          )}

          {!loading && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order) => {
                const s = STATUS_MAP[order.status] || STATUS_MAP.pending;
                return (
                  <div key={order.id} className="border rounded-lg overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      {order.tour?.thumbnail && (
                        <img src={order.tour.thumbnail} alt="" className="w-full sm:w-32 h-24 object-cover flex-shrink-0" />
                      )}
                      <div className="p-3 flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-sm text-[#013879]">{order.tour?.title}</p>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${s.color}`}>
                            <FontAwesomeIcon icon={s.icon} />{s.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Ngày đi: {order.variant?.start_date ? new Date(order.variant.start_date).toLocaleDateString("vi-VN") : "-"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Khách: {order.adult_count} người lớn{order.child_count > 0 && `, ${order.child_count} trẻ em`}
                        </p>
                        <p className="text-xs text-gray-500">Ngày đặt: {formatDate(order.createdAt)}</p>
                        <p className="text-red-500 font-semibold text-sm">{formatPrice(order.total_price)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
