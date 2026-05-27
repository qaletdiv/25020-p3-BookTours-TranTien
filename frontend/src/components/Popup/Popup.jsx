import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

const POPUP_KEY = "contact_popup_seen";

const ContactPopup = () => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "", phone: "", email: "", tour: "", description: "",
  });

  useEffect(() => {
    if (!localStorage.getItem(POPUP_KEY)) setOpen(true);
  }, []);

  const handleClose = () => {
    localStorage.setItem(POPUP_KEY, "true");
    setOpen(false);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axiosClient.post("/contacts", formData);
      alert("Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ bạn sớm.");
      handleClose();
    } catch {
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-[450px] bg-[#013879] text-white p-4 sm:p-6 rounded-xl animate-fadeIn my-8 sm:my-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-2 sm:top-3 right-2 sm:right-3 text-white text-lg sm:text-xl hover:opacity-70"
        >
          ✕
        </button>

        <h2 className="text-center text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Đăng Ký Liên Hệ</h2>
        <p className="text-center mb-4 sm:mb-5 text-xs sm:text-sm">
          Vui lòng điền form dưới đây và gửi cho chúng tôi
        </p>

        <form className="space-y-2 sm:space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="block font-bold mb-1 text-sm sm:text-base">
              Tên khách hàng <span className="text-yellow-300">*</span>
            </label>
            <input
              type="text" name="name" required
              placeholder="Nhập tên khách hàng"
              value={formData.name} onChange={handleChange}
              className="w-full px-3 py-2 sm:py-2.5 text-sm rounded-md border border-gray-300 text-black focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold mb-1 text-sm sm:text-base">
              Điện thoại <span className="text-yellow-300">*</span>
            </label>
            <input
              type="text" name="phone" required
              placeholder="VD: 0123456789"
              value={formData.phone} onChange={handleChange}
              className="w-full px-3 py-2 sm:py-2.5 text-sm rounded-md border border-gray-300 text-black focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold mb-1 text-sm sm:text-base">
              Email <span className="text-yellow-300">*</span>
            </label>
            <input
              type="email" name="email" required
              placeholder="vidu@mail.com"
              value={formData.email} onChange={handleChange}
              className="w-full px-3 py-2 sm:py-2.5 text-sm rounded-md border border-gray-300 text-black focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold mb-1 text-sm sm:text-base">Tour quan tâm</label>
            <select
              name="tour" value={formData.tour} onChange={handleChange}
              className="w-full px-3 py-2 sm:py-2.5 text-sm rounded-md border border-gray-300 text-black focus:outline-none"
            >
              <option value="">Vui lòng chọn</option>
              <option value="domestic">Tour trong nước</option>
              <option value="international">Tour ngoài nước</option>
            </select>
          </div>

          <div>
            <label className="block font-bold mb-1 text-sm sm:text-base">Mô tả</label>
            <textarea
              rows={3} name="description"
              placeholder="Nhập nội dung mô tả..."
              value={formData.description} onChange={handleChange}
              className="w-full px-3 py-2 sm:py-2.5 text-sm rounded-md border border-gray-300 text-black resize-none focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-3 sm:mt-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-md bg-white text-[#013879]
                       font-bold transition duration-300 hover:bg-[#013879] hover:text-white border border-white
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Đang gửi..." : "Gửi yêu cầu tư vấn"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPopup;
