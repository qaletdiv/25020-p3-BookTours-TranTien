import {
  VN,
  US,
  TW,
  GB,
  AF,
  AL,
  DZ,
  AS,
  AD,
  AO,
  AI,
  AG,
  AR,
  AM,
  AW,
  AC,
  AU,
  AT,
  IN,
} from "country-flag-icons/react/3x2";
import { useState, useRef, useEffect } from "react";

const FLAGS = [
  { code: "VN", name: "Vietnam", dialCode: "+84", Icon: VN },
  { code: "US", name: "United States", dialCode: "+1", Icon: US },
  { code: "TW", name: "Taiwan", dialCode: "+886", Icon: TW },
  { code: "GB", name: "United Kingdom", dialCode: "+44", Icon: GB },
  { code: "AF", name: "Afghanistan (افغانستان)", dialCode: "+93", Icon: AF },
  { code: "AL", name: "Albania (Shqipëri)", dialCode: "+355", Icon: AL },
  { code: "DZ", name: "Algeria (الجزائر)", dialCode: "+213", Icon: DZ },
  { code: "AS", name: "American Samoa", dialCode: "+1", Icon: AS },
  { code: "AD", name: "Andorra", dialCode: "+376", Icon: AD },
  { code: "AO", name: "Angola", dialCode: "+244", Icon: AO },
  { code: "AI", name: "Anguilla", dialCode: "+1", Icon: AI },
  { code: "AG", name: "Antigua and Barbuda", dialCode: "+1", Icon: AG },
  { code: "AR", name: "Argentina", dialCode: "+54", Icon: AR },
  { code: "AM", name: "Armenia (Հայաստան)", dialCode: "+374", Icon: AM },
  { code: "AW", name: "Aruba", dialCode: "+297", Icon: AW },
  { code: "AC", name: "Ascension Island", dialCode: "+247", Icon: AC },
  { code: "AU", name: "Australia", dialCode: "+61", Icon: AU },
  { code: "AT", name: "Austria (Österreich)", dialCode: "+43", Icon: AT },
  { code: "IN", name: "India", dialCode: "+91", Icon: IN },
];

const Contacts = ({ orderByUser, setUserInfo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState(FLAGS[0]);
  const [username, setUserName] = useState(orderByUser?.userName || "");
  const [userEmail, setUserEmail] = useState(orderByUser?.userEmail || "");
  const [userPhone, setUserPhone] = useState(
    orderByUser?.userPhone ? String(orderByUser.userPhone) : ""
  );
  const [userAddress, setUserAddress] = useState("");

  //Cập nhật lại mới mỗi khi khách hàng thay đổi thông tin
  useEffect(() => {
    setUserInfo({
      name: username,
      email: userEmail,
      phone: userPhone,
      address: userAddress,
    });
  }, [username, userEmail, userPhone, userAddress]);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (value) => {
    setSelectedFlag(value);
    setIsOpen(false);
  };

  return (
    <div>
      <h2 className="text-2xl my-5 font-bold">Thông Tin Liên Lạc</h2>

      <div className="bg-[#f6f8fa] px-5 py-6">
        {/* Row 1 */}
        <div className="flex flex-col md:flex-row gap-5">
          <div className="w-full md:w-1/2">
            <p className="text-sm font-semibold my-3">
              Họ và tên <span className="text-red-500 text-xs">*</span>
            </p>
            <input
              type="text"
              value={username}
              placeholder="Nhập Họ và tên"
              className="w-full text-xs focus:outline-none px-4 py-5"
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className="w-full md:w-1/2">
            <p className="text-sm font-semibold my-3">
              Email <span className="text-red-500 text-xs">*</span>
            </p>
            <input
              type="text"
              value={userEmail}
              placeholder="sample@gmail.com"
              className="w-full text-xs focus:outline-none px-4 py-5"
              onChange={(e) => setUserEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col md:flex-row gap-5 mt-3 relative">
          <div className="w-full md:w-1/2">
            <p className="text-sm font-semibold my-3">
              Số điện thoại <span className="text-red-500 text-xs">*</span>
            </p>

            <div className="flex">
              <div
                ref={dropdownRef}
                className="flex items-center justify-center space-x-2 w-[100px] bg-[#f2f2f2] px-2 text-xs cursor-pointer select-none"
                onClick={() => setIsOpen(!isOpen)}
              >
                <selectedFlag.Icon className="w-5 h-5" />
                <p>{selectedFlag.dialCode}</p>
              </div>

              <input
                type="text"
                value={userPhone}
                placeholder="Nhập Số điện thoại liên hệ"
                className="w-full text-xs focus:outline-none px-4 py-5"
                onChange={(e) => setUserPhone(e.target.value)}
              />
            </div>

            {/* Dropdown */}
            <div
              className={`absolute bg-white shadow-lg border mt-1 max-h-[300px] overflow-auto z-20 ${
                isOpen ? "block" : "hidden"
              }`}
            >
              {FLAGS.map((flag) => (
                <div
                  key={flag.code}
                  onMouseDown={() => handleSelect(flag)}
                  className={`flex items-center gap-2 p-2 cursor-pointer ${
                    selectedFlag === flag
                      ? "bg-[#013879] text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <flag.Icon className="w-5 h-5" />
                  <span>{flag.dialCode}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <p className="text-sm font-semibold my-3">
              Địa chỉ <span className="text-red-500 text-xs">*</span>
            </p>
            <input
              type="text"
              value={userAddress}
              placeholder="Nhập địa chỉ liên hệ"
              className="w-full text-xs focus:outline-none px-4 py-5"
              onChange={(e) => setUserAddress(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
