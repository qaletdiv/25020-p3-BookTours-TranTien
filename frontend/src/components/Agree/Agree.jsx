
const Agree = ({ agree, setAgree }) => {
  return (
    <div className="bg-[#f6f8fa] px-5 py-6">
      <p className="text-sm leading-relaxed">
        Bằng cách nhấp chuột vào nút "ĐỒNG Ý" dưới đây, Khách hàng đồng ý rằng
        các Điều kiện điều khoản này sẽ được áp dụng. Vui lòng đọc kỹ Điều kiện
        điều khoản trước khi lựa chọn sử dụng dịch vụ của Lửa Việt Tours.
      </p>

      <div className="flex items-start sm:items-center gap-3 mt-4">
        <label className="flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agree}
            onChange={() => setAgree(!agree)}
            className="hidden"
          />

          <span
            className={`flex h-5 w-5 items-center justify-center rounded border
              ${
                agree
                  ? "bg-[#013879] border-[#013879] text-white"
                  : "border-gray-800 text-transparent"
              }
            `}
          >
            ✓
          </span>
        </label>

        <p className="text-sm">
          Tôi đã đọc và đồng ý với{" "}
          <a
            href="https://www.luavietours.com/assets/pdf/dieu_khoan_chung.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#013879] underline font-semibold"
          >
            Điều khoản thanh toán
          </a>
        </p>
      </div>
    </div>
  );
};

export default Agree;
