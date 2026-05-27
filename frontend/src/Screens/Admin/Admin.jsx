import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { logout } from "../../redux/slices/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers, faListAlt, faMapMarkedAlt, faChartBar,
  faSignOutAlt, faBars, faTimes, faEdit, faTrash,
  faCheckCircle, faTimesCircle, faClock, faPlus, faEnvelope,
  faStar, faImage, faCalendarAlt, faUpload, faLink, faSpinner
} from "@fortawesome/free-solid-svg-icons";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:3000";

const TABS = [
  { id: "stats",    label: "Tổng Quan",    icon: faChartBar },
  { id: "users",    label: "Người Dùng",   icon: faUsers },
  { id: "orders",   label: "Đơn Hàng",     icon: faListAlt },
  { id: "tours",    label: "Quản Lý Tour", icon: faMapMarkedAlt },
  { id: "contacts", label: "Liên Hệ",      icon: faEnvelope },
];

const STATUS_MAP = {
  pending:   { label: "Chờ xác nhận", color: "text-yellow-600 bg-yellow-100", icon: faClock },
  confirmed: { label: "Đã xác nhận",  color: "text-green-600 bg-green-100",  icon: faCheckCircle },
  cancelled: { label: "Đã hủy",       color: "text-red-600 bg-red-100",      icon: faTimesCircle },
};

const EMPTY_VARIANT = { start_date: "", end_date: "", price: "", discount_percent: "", child_discount_percent: "" };

export default function Admin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userStr  = useSelector((s) => s.auth.user);
  const user     = userStr ? JSON.parse(userStr) : null;

  const [activeTab, setActiveTab] = useState("stats");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats]     = useState(null);
  const [users, setUsers]     = useState([]);
  const [orders, setOrders]   = useState([]);
  const [tours, setTours]     = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Tour form
  const [showTourForm, setShowTourForm] = useState(false);
  const [editingTour, setEditingTour]   = useState(null);
  const [tourForm, setTourForm] = useState({
    title: "", description: "", location: "", destination: "",
    duration: "", thumbnail: "", slug: "", category_id: ""
  });
  const [categories, setCategories] = useState([]);

  // Variants state
  const [variants, setVariants]       = useState([]);
  const [newVariant, setNewVariant]   = useState(EMPTY_VARIANT);

  // Images state
  const [tourImages, setTourImages]     = useState([]);
  const [newImageUrl, setNewImageUrl]   = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin") { navigate("/"); return; }
    loadStats();
    axiosClient.get("/categories").then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (activeTab === "users")    loadUsers();
    if (activeTab === "orders")   loadOrders();
    if (activeTab === "tours")    loadTours();
    if (activeTab === "stats")    loadStats();
    if (activeTab === "contacts") loadContacts();
  }, [activeTab]);

  const loadStats    = async () => { try { setLoading(true); const { data } = await axiosClient.get("/admin/stats"); setStats(data); } catch { } finally { setLoading(false); } };
  const loadUsers    = async () => { try { setLoading(true); const { data } = await axiosClient.get("/admin/users"); setUsers(data); } catch { } finally { setLoading(false); } };
  const loadOrders   = async () => { try { setLoading(true); const { data } = await axiosClient.get("/admin/orders"); setOrders(data); } catch { } finally { setLoading(false); } };
  const loadContacts = async () => { try { setLoading(true); const { data } = await axiosClient.get("/admin/contacts"); setContacts(data); } catch { } finally { setLoading(false); } };
  const loadTours    = async () => { try { setLoading(true); const { data } = await axiosClient.get("/tours"); setTours(data); } catch { } finally { setLoading(false); } };

  const handleRoleChange = async (userId, role) => {
    if (!window.confirm(`Đổi quyền người dùng này thành "${role}"?`)) return;
    try {
      await axiosClient.patch(`/admin/users/${userId}/role`, { role });
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role } : u));
    } catch (err) { alert(err.response?.data?.message || "Lỗi khi cập nhật quyền"); }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await axiosClient.patch(`/admin/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
    } catch (err) { alert(err.response?.data?.message || "Lỗi khi cập nhật trạng thái"); }
  };

  const handleDeleteTour = async (id) => {
    if (!window.confirm("Xác nhận xóa tour này?")) return;
    try {
      await axiosClient.delete(`/admin/tours/${id}`);
      setTours((prev) => prev.filter((t) => t.id !== id));
    } catch (err) { alert(err.response?.data?.message || "Lỗi khi xóa tour"); }
  };

  const openTourForm = (tour = null) => {
    if (tour) {
      setEditingTour(tour);
      setTourForm({
        title: tour.title || "", description: tour.description || "",
        location: tour.location || "", destination: tour.destination || "",
        duration: tour.duration || "", thumbnail: tour.thumbnail || "",
        slug: tour.slug || "", category_id: tour.category_id || ""
      });
      setVariants(
        (tour.variants || []).map((v) => ({
          start_date: v.start_date || "", end_date: v.end_date || "",
          price: v.price || "", discount_percent: v.discount_percent || "",
          child_discount_percent: v.child_discount_percent || "",
          final_price: v.final_price || v.price || ""
        }))
      );
      setTourImages((tour.images || []).map((img) => ({ image_url: img.image_url, is_thumbnail: !!img.is_thumbnail })));
    } else {
      setEditingTour(null);
      setTourForm({ title: "", description: "", location: "", destination: "", duration: "", thumbnail: "", slug: "", category_id: "" });
      setVariants([]);
      setTourImages([]);
    }
    setNewVariant(EMPTY_VARIANT);
    setNewImageUrl("");
    setShowTourForm(true);
  };

  // ---- Variant helpers ----
  const addVariant = () => {
    if (!newVariant.start_date || !newVariant.price) {
      alert("Vui lòng nhập ngày đi và giá");
      return;
    }
    const price       = parseInt(newVariant.price) || 0;
    const discPct     = parseInt(newVariant.discount_percent) || 0;
    const finalPrice  = discPct ? Math.round(price * (1 - discPct / 100)) : price;
    setVariants((prev) => [
      ...prev,
      { ...newVariant, price, discount_percent: discPct, child_discount_percent: parseInt(newVariant.child_discount_percent) || 0, final_price: finalPrice }
    ]);
    setNewVariant(EMPTY_VARIANT);
  };

  const removeVariant = (idx) => setVariants((prev) => prev.filter((_, i) => i !== idx));

  // ---- Image helpers ----
  const addImage = () => {
    if (!newImageUrl.trim()) return;
    setTourImages((prev) => {
      const isFirst = prev.length === 0;
      return [...prev, { image_url: newImageUrl.trim(), is_thumbnail: isFirst }];
    });
    setNewImageUrl("");
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploadingImages(true);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("images", f));
      const { data } = await axiosClient.post("/admin/upload-images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTourImages((prev) => {
        const newImgs = data.urls.map((url, i) => ({
          image_url: url,
          is_thumbnail: prev.length === 0 && i === 0,
        }));
        return [...prev, ...newImgs];
      });
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi upload ảnh");
    } finally {
      setUploadingImages(false);
      e.target.value = "";
    }
  };

  const removeImage = (idx) => {
    setTourImages((prev) => {
      const wasThumbnail = prev[idx]?.is_thumbnail;
      const updated = prev.filter((_, i) => i !== idx);
      if (wasThumbnail && updated.length > 0) {
        updated[0] = { ...updated[0], is_thumbnail: true };
      }
      return updated;
    });
  };

  const setAsThumbnail = (idx) => {
    setTourImages((prev) => prev.map((img, i) => ({ ...img, is_thumbnail: i === idx })));
    // Sync thumbnail field
    const url = tourImages[idx]?.image_url;
    if (url) setTourForm((f) => ({ ...f, thumbnail: url }));
  };

  const handleTourSubmit = async (e) => {
    e.preventDefault();
    try {
      // If any image is marked as thumbnail, sync the thumbnail field
      const thumbImg = tourImages.find((img) => img.is_thumbnail);
      const payload = {
        ...tourForm,
        thumbnail: thumbImg ? thumbImg.image_url : tourForm.thumbnail,
        variants,
        images: tourImages,
      };
      if (editingTour) {
        const { data } = await axiosClient.put(`/admin/tours/${editingTour.id}`, payload);
        setTours((prev) => prev.map((t) => t.id === editingTour.id ? data : t));
      } else {
        const { data } = await axiosClient.post("/admin/tours", payload);
        setTours((prev) => [data, ...prev]);
      }
      setShowTourForm(false);
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi lưu tour");
    }
  };

  const formatPrice = (p) => parseInt(p || 0).toLocaleString("vi-VN") + " đ";
  const formatDate  = (d) => d ? new Date(d).toLocaleDateString("vi-VN") : "-";
  const fmtDate     = (d) => d ? new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }) : "-";

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#013879] text-white flex flex-col transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:flex`}
      >
        <div className="px-6 py-5 border-b border-blue-700 flex items-center justify-between">
          <span className="text-xl font-bold tracking-wide">Admin Panel</span>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <nav className="flex-1 py-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors
                ${activeTab === tab.id ? "bg-blue-700 text-white" : "hover:bg-blue-800 text-blue-200"}`}
            >
              <FontAwesomeIcon icon={tab.icon} className="w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-blue-700 space-y-2">
          <p className="text-xs text-blue-300 truncate">{user?.email}</p>
          <button
            onClick={() => { dispatch(logout()); navigate("/dang-nhap"); }}
            className="w-full flex items-center gap-2 text-sm text-red-300 hover:text-red-100"
          >
            <FontAwesomeIcon icon={faSignOutAlt} /> Đăng xuất
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <button className="md:hidden text-[#013879]" onClick={() => setSidebarOpen(true)}>
            <FontAwesomeIcon icon={faBars} className="text-xl" />
          </button>
          <h1 className="text-lg font-semibold text-[#013879]">
            {TABS.find((t) => t.id === activeTab)?.label}
          </h1>
          <button onClick={() => navigate("/")} className="text-sm text-blue-600 hover:underline hidden md:block">
            ← Về trang chủ
          </button>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {loading && (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* STATS */}
          {!loading && activeTab === "stats" && stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Người dùng", value: stats.totalUsers,   color: "bg-blue-500" },
                  { label: "Đơn hàng",   value: stats.totalOrders,  color: "bg-green-500" },
                  { label: "Tour",       value: stats.totalTours,   color: "bg-yellow-500" },
                  { label: "Doanh thu",  value: formatPrice(stats.totalRevenue), color: "bg-red-500" },
                ].map((item) => (
                  <div key={item.label} className={`${item.color} text-white p-5 rounded-lg shadow`}>
                    <p className="text-sm opacity-80">{item.label}</p>
                    <p className="text-2xl font-bold mt-1 break-all">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500 text-sm">Chào mừng, <strong>{user?.username}</strong>! Chọn mục từ sidebar để quản lý.</p>
              </div>
            </div>
          )}

          {/* USERS */}
          {!loading && activeTab === "users" && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-3 border-b">
                <p className="font-semibold text-[#013879]">Danh sách người dùng ({users.length})</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                    <tr>{["Avatar","ID","Tên đăng nhập","Email","Số điện thoại","Vai trò","Ngày tạo","Thao tác"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          {u.avatar
                            ? <img src={`${API_BASE}${u.avatar}`} alt="" className="w-9 h-9 rounded-full object-cover border" />
                            : <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs font-bold">{u.username?.[0]?.toUpperCase()}</div>
                          }
                        </td>
                        <td className="px-4 py-3 text-gray-400">{u.id}</td>
                        <td className="px-4 py-3 font-medium">{u.username}</td>
                        <td className="px-4 py-3 text-gray-600 break-all">{u.email}</td>
                        <td className="px-4 py-3">{u.phone || "-"}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`}>{u.role}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-500">{formatDate(u.createdAt)}</td>
                        <td className="px-4 py-3">
                          <select value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value)} className="text-xs border rounded px-2 py-1 focus:outline-none focus:border-blue-400">
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && <p className="text-center text-gray-400 py-8">Không có dữ liệu</p>}
              </div>
            </div>
          )}

          {/* ORDERS */}
          {!loading && activeTab === "orders" && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-3 border-b">
                <p className="font-semibold text-[#013879]">Danh sách đơn hàng ({orders.length})</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                    <tr>{["ID","Tour","Khách hàng","SĐT","Ngày đặt","Người lớn","Trẻ em","Tổng tiền","Thanh toán","Trạng thái","Thao tác"].map((h) => (
                      <th key={h} className="px-3 py-3 text-left whitespace-nowrap">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((o) => {
                      const s = STATUS_MAP[o.status] || STATUS_MAP.pending;
                      return (
                        <tr key={o.id} className="hover:bg-gray-50">
                          <td className="px-3 py-3 text-gray-400">{o.id}</td>
                          <td className="px-3 py-3 font-medium max-w-[160px]"><span className="line-clamp-2">{o.tour?.title || "-"}</span></td>
                          <td className="px-3 py-3 whitespace-nowrap">{o.contact_name}</td>
                          <td className="px-3 py-3">{o.contact_phone}</td>
                          <td className="px-3 py-3 whitespace-nowrap">{formatDate(o.createdAt)}</td>
                          <td className="px-3 py-3 text-center">{o.adult_count}</td>
                          <td className="px-3 py-3 text-center">{o.child_count}</td>
                          <td className="px-3 py-3 text-red-600 font-semibold whitespace-nowrap">{formatPrice(o.total_price)}</td>
                          <td className="px-3 py-3 whitespace-nowrap">{o.payment_method || "-"}</td>
                          <td className="px-3 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${s.color}`}>
                              <FontAwesomeIcon icon={s.icon} />{s.label}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <select value={o.status} onChange={(e) => handleStatusChange(o.id, e.target.value)} className="text-xs border rounded px-2 py-1 focus:outline-none focus:border-blue-400">
                              <option value="pending">Chờ xác nhận</option>
                              <option value="confirmed">Xác nhận</option>
                              <option value="cancelled">Hủy</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {orders.length === 0 && <p className="text-center text-gray-400 py-8">Chưa có đơn hàng nào</p>}
              </div>
            </div>
          )}

          {/* TOURS */}
          {!loading && activeTab === "tours" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-[#013879]">Danh sách tour ({tours.length})</p>
                <button onClick={() => openTourForm()} className="flex items-center gap-2 bg-[#013879] text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                  <FontAwesomeIcon icon={faPlus} /> Thêm Tour
                </button>
              </div>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                      <tr>{["Ảnh","Tên tour","Danh mục","Điểm đi","Điểm đến","Số ngày","Biến thể","Slug","Thao tác"].map((h) => (
                        <th key={h} className="px-3 py-3 text-left whitespace-nowrap">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {tours.map((t) => (
                        <tr key={t.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2">
                            {t.thumbnail
                              ? <img src={t.thumbnail} alt="" className="w-16 h-12 object-cover rounded" onError={(e) => e.target.style.display = "none"} />
                              : <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-300"><FontAwesomeIcon icon={faImage} /></div>
                            }
                          </td>
                          <td className="px-3 py-2 font-medium max-w-[200px]"><span className="line-clamp-2">{t.title}</span></td>
                          <td className="px-3 py-2">{t.category?.name || "-"}</td>
                          <td className="px-3 py-2">{t.location || "-"}</td>
                          <td className="px-3 py-2">{t.destination || "-"}</td>
                          <td className="px-3 py-2 text-center">{t.duration}</td>
                          <td className="px-3 py-2 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.variants?.length > 0 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                              {t.variants?.length || 0} ngày
                            </span>
                          </td>
                          <td className="px-3 py-2 text-gray-400 text-xs">{t.slug}</td>
                          <td className="px-3 py-2">
                            <div className="flex gap-2">
                              <button onClick={() => openTourForm(t)} className="text-blue-600 hover:text-blue-800 p-1" title="Chỉnh sửa"><FontAwesomeIcon icon={faEdit} /></button>
                              <button onClick={() => handleDeleteTour(t.id)} className="text-red-500 hover:text-red-700 p-1" title="Xóa"><FontAwesomeIcon icon={faTrash} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {tours.length === 0 && <p className="text-center text-gray-400 py-8">Không có tour nào</p>}
                </div>
              </div>
            </div>
          )}

          {/* CONTACTS */}
          {!loading && activeTab === "contacts" && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-3 border-b">
                <p className="font-semibold text-[#013879]">Yêu cầu tư vấn ({contacts.length})</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                    <tr>{["ID","Họ tên","Điện thoại","Email","Tour quan tâm","Mô tả","Ngày gửi"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {contacts.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-400">{c.id}</td>
                        <td className="px-4 py-3 font-medium">{c.name}</td>
                        <td className="px-4 py-3">{c.phone}</td>
                        <td className="px-4 py-3 break-all">{c.email}</td>
                        <td className="px-4 py-3">{c.tour_interest === "domestic" ? "Tour trong nước" : c.tour_interest === "international" ? "Tour ngoài nước" : "-"}</td>
                        <td className="px-4 py-3 max-w-[200px]"><span className="line-clamp-2 text-gray-500">{c.description || "-"}</span></td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-500">{formatDate(c.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {contacts.length === 0 && <p className="text-center text-gray-400 py-8">Chưa có yêu cầu tư vấn nào</p>}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Tour Form Modal */}
      {showTourForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">
            <div className="px-6 py-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold text-[#013879]">
                {editingTour ? "Chỉnh Sửa Tour" : "Thêm Tour Mới"}
              </h2>
              <button onClick={() => setShowTourForm(false)} className="text-gray-400 hover:text-gray-600">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form onSubmit={handleTourSubmit} className="p-6 space-y-6">

              {/* === THÔNG TIN CƠ BẢN === */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Thông tin cơ bản</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Tên Tour *", key: "title", required: true },
                    { label: "Slug *",     key: "slug",  required: true },
                    { label: "Điểm khởi hành", key: "location" },
                    { label: "Điểm đến",       key: "destination" },
                    { label: "Số ngày",         key: "duration", type: "number" },
                    { label: "Ảnh đại diện (URL)", key: "thumbnail" },
                  ].map(({ label, key, required, type }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <input
                        type={type || "text"}
                        value={tourForm[key]}
                        onChange={(e) => setTourForm({ ...tourForm, [key]: e.target.value })}
                        required={required}
                        className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                    <select
                      value={tourForm.category_id}
                      onChange={(e) => setTourForm({ ...tourForm, category_id: e.target.value })}
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea
                    rows={3}
                    value={tourForm.description}
                    onChange={(e) => setTourForm({ ...tourForm, description: e.target.value })}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              {/* === BIẾN THỂ NGÀY ĐI === */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 flex items-center gap-2 border-b">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-[#013879]" />
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Biến thể ngày khởi hành</h3>
                  <span className="ml-auto text-xs text-gray-500">{variants.length} biến thể</span>
                </div>

                <div className="p-4 space-y-2">
                  {variants.length === 0 && (
                    <p className="text-center text-gray-400 text-sm py-2">Chưa có biến thể. Thêm bên dưới.</p>
                  )}
                  {variants.map((v, i) => (
                    <div key={i} className="flex flex-wrap items-center gap-2 bg-blue-50 border border-blue-100 rounded px-3 py-2 text-sm">
                      <span className="font-medium text-blue-800">
                        {fmtDate(v.start_date)}{v.end_date && v.end_date !== v.start_date ? ` → ${fmtDate(v.end_date)}` : ""}
                      </span>
                      <span className="text-gray-600">Giá: <strong>{parseInt(v.price).toLocaleString("vi-VN")} đ</strong></span>
                      {v.discount_percent > 0 && (
                        <span className="text-orange-600">Giảm: {v.discount_percent}% → <strong>{parseInt(v.final_price).toLocaleString("vi-VN")} đ</strong></span>
                      )}
                      {v.child_discount_percent > 0 && (
                        <span className="text-purple-600">Trẻ em: -{v.child_discount_percent}%</span>
                      )}
                      <button type="button" onClick={() => removeVariant(i)} className="ml-auto text-red-500 hover:text-red-700 p-0.5">
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  ))}

                  {/* Add variant form */}
                  <div className="border-t pt-3 mt-3">
                    <p className="text-xs font-medium text-gray-600 mb-2">Thêm biến thể mới:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs text-gray-500 mb-0.5">Ngày đi *</label>
                        <input type="date" value={newVariant.start_date}
                          onChange={(e) => setNewVariant({ ...newVariant, start_date: e.target.value })}
                          className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-0.5">Ngày về</label>
                        <input type="date" value={newVariant.end_date}
                          onChange={(e) => setNewVariant({ ...newVariant, end_date: e.target.value })}
                          className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-0.5">Giá gốc (đ) *</label>
                        <input type="number" min="0" value={newVariant.price}
                          onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
                          placeholder="VD: 5000000"
                          className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-0.5">Giảm người lớn (%)</label>
                        <input type="number" min="0" max="100" value={newVariant.discount_percent}
                          onChange={(e) => setNewVariant({ ...newVariant, discount_percent: e.target.value })}
                          placeholder="VD: 10"
                          className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-0.5">Giảm trẻ em (%)</label>
                        <input type="number" min="0" max="100" value={newVariant.child_discount_percent}
                          onChange={(e) => setNewVariant({ ...newVariant, child_discount_percent: e.target.value })}
                          placeholder="VD: 20"
                          className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400" />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={addVariant}
                          className="w-full bg-[#013879] text-white rounded px-3 py-1.5 text-sm hover:bg-blue-700 flex items-center justify-center gap-1"
                        >
                          <FontAwesomeIcon icon={faPlus} /> Thêm
                        </button>
                      </div>
                    </div>
                    {newVariant.price && newVariant.discount_percent && (
                      <p className="text-xs text-green-600 mt-1">
                        Giá sau giảm: {Math.round(parseInt(newVariant.price) * (1 - parseInt(newVariant.discount_percent) / 100)).toLocaleString("vi-VN")} đ
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* === HÌNH ẢNH TOUR === */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 flex items-center gap-2 border-b">
                  <FontAwesomeIcon icon={faImage} className="text-[#013879]" />
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Hình ảnh tour</h3>
                  <span className="ml-auto text-xs text-gray-500">{tourImages.length} ảnh</span>
                </div>

                <div className="p-4 space-y-3">
                  {tourImages.length === 0 && (
                    <p className="text-center text-gray-400 text-sm py-2">Chưa có ảnh. Thêm URL ảnh bên dưới.</p>
                  )}

                  {/* Image grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {tourImages.map((img, i) => (
                      <div key={i} className={`relative rounded-lg overflow-hidden border-2 ${img.is_thumbnail ? "border-blue-500" : "border-gray-200"}`}>
                        <img
                          src={img.image_url}
                          alt={`Ảnh ${i + 1}`}
                          className="w-full h-28 object-cover"
                          onError={(e) => { e.target.src = ""; e.target.className = "w-full h-28 bg-gray-100"; }}
                        />
                        {img.is_thumbnail && (
                          <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
                            <FontAwesomeIcon icon={faStar} className="text-xs" /> Đại diện
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 flex gap-1 p-1">
                          {!img.is_thumbnail && (
                            <button
                              type="button"
                              onClick={() => setAsThumbnail(i)}
                              className="flex-1 text-xs text-yellow-300 hover:text-yellow-100 truncate"
                              title="Đặt làm ảnh đại diện"
                            >
                              <FontAwesomeIcon icon={faStar} /> Đại diện
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="text-xs text-red-400 hover:text-red-200 px-1"
                            title="Xóa ảnh"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Upload file */}
                  <div className="border-t pt-3 space-y-2">
                    <label className={`flex items-center justify-center gap-2 w-full border-2 border-dashed rounded-lg py-4 cursor-pointer transition-colors
                      ${uploadingImages ? "border-gray-300 bg-gray-50 cursor-not-allowed" : "border-blue-300 hover:border-blue-500 hover:bg-blue-50"}`}>
                      {uploadingImages
                        ? <><FontAwesomeIcon icon={faSpinner} spin className="text-blue-500" /><span className="text-sm text-blue-500">Đang upload...</span></>
                        : <><FontAwesomeIcon icon={faUpload} className="text-blue-500" /><span className="text-sm text-blue-600 font-medium">Chọn ảnh từ máy tính</span><span className="text-xs text-gray-400">(có thể chọn nhiều ảnh)</span></>
                      }
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={uploadingImages}
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    {/* URL fallback */}
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1 text-gray-400 shrink-0">
                        <FontAwesomeIcon icon={faLink} className="text-xs" />
                        <span className="text-xs">hoặc dán URL:</span>
                      </div>
                      <input
                        type="text"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }}
                        placeholder="https://..."
                        className="flex-1 border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400"
                      />
                      <button type="button" onClick={addImage} className="bg-gray-600 text-white rounded px-3 py-1.5 text-sm hover:bg-gray-700 whitespace-nowrap">
                        Thêm
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">Ảnh đầu tiên tự động làm ảnh đại diện. Nhấn ⭐ dưới ảnh để đổi ảnh đại diện.</p>
                </div>
              </div>

              {/* Submit buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowTourForm(false)} className="px-5 py-2 border rounded text-sm hover:bg-gray-100">Hủy</button>
                <button type="submit" className="px-5 py-2 bg-[#013879] text-white rounded text-sm hover:bg-blue-700">
                  {editingTour ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
