import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyCheck, faWallet, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { CardElement } from "@stripe/react-stripe-js";
import Address from "../Address/Address";

const PayList = [
  { id: 1, text: "Thanh toán tại văn phòng Lửa Việt", icon: faMoneyCheck },
  { id: 2, text: "Chuyển khoản online", icon: faWallet },
  { id: 3, text: "Thanh toán online (Stripe)", icon: faCreditCard },
];

const CARD_STYLE = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": { color: "#aab7c4" },
    },
    invalid: { color: "#9e2146" },
  },
};

const Payment = ({ selectedPayment, setSelectedPayment }) => {
  return (
    <div>
      <h2 className="text-2xl my-5 font-bold">Phương Thức Thanh Toán</h2>
      <div>
        {PayList.map((option) => (
          <div key={option.id} className="flex flex-col justify-start items-start w-full space-y-3 mb-3">
            <label className="flex items-start sm:items-center space-x-4 cursor-pointer select-none w-full">
              <div>
                <input
                  type="radio"
                  name="radio"
                  value={option.id}
                  checked={selectedPayment?.id === option.id}
                  onChange={() => setSelectedPayment(option)}
                  className="hidden"
                />
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    selectedPayment?.id === option.id ? "border-[#013879]" : "border-gray-800"
                  }`}
                >
                  <div
                    className={`flex h-3 w-3 items-center justify-center rounded-full ${
                      selectedPayment?.id === option.id ? "bg-[#013879]" : ""
                    }`}
                  />
                </div>
              </div>
              <FontAwesomeIcon
                icon={option.icon}
                className={selectedPayment?.id === option.id ? "text-[#013879] text-xl" : "text-xl"}
              />
              <span
                className={
                  selectedPayment?.id === option.id
                    ? "text-[#013879] text-sm sm:text-md font-semibold"
                    : "text-sm sm:text-md"
                }
              >
                {option.text}
              </span>
            </label>

            <div className="ml-0 sm:ml-9 mb-6 w-full">
              {selectedPayment?.id === option.id && option.id === 1 && <Address />}
              {selectedPayment?.id === option.id && option.id === 3 && (
                <div className="border rounded p-4 bg-gray-50 max-w-md">
                  <p className="text-sm text-gray-500 mb-3">
                    Thẻ test thành công: <span className="font-mono font-semibold">4242 4242 4242 4242</span> — MM/YY bất kỳ (vd: 12/34) — CVC bất kỳ (vd: 123)
                  </p>
                  <CardElement options={CARD_STYLE} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Payment;
