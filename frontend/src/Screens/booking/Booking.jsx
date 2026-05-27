import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import LoadingSpinner from "../../components/Loading/Loading";
import Contacts from "../../components/contacts/Contacts";
import PassengerCount from "../../components/PassengerCount/PassengerCount";
import GuestInfo from "../../components/GuestInfo/GuestInfo";
import TakeNote from "../../components/TakeNote/TakeNote";
import Agree from "../../components/Agree/Agree";
import Payment from "../../components/Payment/Payment";
import PayBox from "../../components/PayBox/PayBox";
import { addOrder } from "../../redux/slices/orderSlice";
import axiosClient from "../../api/axiosClient";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const BookingContent = () => {
  const dispatch    = useDispatch();
  const nav         = useNavigate();
  const stripe      = useStripe();
  const elements    = useElements();
  const orderByUser = useSelector((s) => s.cart.orderByUser) || {};
  const loading     = useSelector((s) => s.orders.loading);

  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [userInfo, setUserInfo] = useState({
    name:    orderByUser.userName  || "",
    email:   orderByUser.userEmail || "",
    phone:   orderByUser.userPhone || "",
    address: "",
  });
  const [guests, setGuests]           = useState([]);
  const [userNote, setUserNote]       = useState({ have: [], takeNote: "" });
  const [agree, setAgree]             = useState(false);
  const [selectedPayment, setPayment] = useState(null);
  const [stripeLoading, setStripeLoading] = useState(false);

  const adultTotal = adultCount * (orderByUser.price || 0);
  const childTotal = childCount * (orderByUser.price || 0) * 0.8;
  const Total = adultTotal + childTotal;

  if (!orderByUser || !orderByUser.price || Object.keys(orderByUser).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Vui lòng chọn tour trước khi đặt hàng</p>
          <button onClick={() => nav("/tour-du-lich")} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Quay lại trang tour
          </button>
        </div>
      </div>
    );
  }

  const handleCart = async () => {
    const validations = [
      { condition: !orderByUser.departureDate, message: "Vui lòng chọn ngày khởi hành trước khi đặt tour" },
      { condition: !userInfo.name || !userInfo.email || !userInfo.phone || !userInfo.address, message: "Thiếu thông tin liên lạc" },
      { condition: adultCount <= 0, message: "Phải có ít nhất 1 người lớn" },
      {
        condition: guests.length !== adultCount + childCount || guests.some((g) => !g || !g.fullName || !g.sex || !g.birthday),
        message: "Vui lòng điền đầy đủ thông tin hành khách (họ tên, giới tính, ngày sinh)",
        scrollTo: "guest-info",
      },
      { condition: !selectedPayment, message: "Chưa chọn phương thức thanh toán" },
      { condition: !agree, message: "Chưa đồng ý điều khoản" },
      { condition: Total <= 0, message: "Tổng tiền không hợp lệ" },
    ];
    const error = validations.find((v) => v.condition);
    if (error) {
      alert(error.message);
      if (error.scrollTo) {
        document.getElementById(error.scrollTo)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    const orderData = { userInfo, orderByUser, adultCount, childCount, guests, Total, userNote, selectedPayment };

    // Thanh toán Stripe
    if (selectedPayment?.id === 3) {
      if (!stripe || !elements) { alert("Stripe chưa sẵn sàng, vui lòng thử lại"); return; }
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) { alert("Vui lòng nhập thông tin thẻ"); return; }

      try {
        setStripeLoading(true);
        const { data } = await axiosClient.post("/payment/create-intent", { amount: Total });
        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: { name: userInfo.name, email: userInfo.email },
          },
        });
        if (stripeError) { alert(stripeError.message); return; }
        await dispatch(addOrder({ ...orderData, stripePaymentId: paymentIntent.id })).unwrap();
        nav("/confirm");
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || "Thanh toán thất bại, vui lòng thử lại";
        alert(msg);
      } finally {
        setStripeLoading(false);
      }
      return;
    }

    // Thanh toán thông thường
    try {
      await dispatch(addOrder(orderData)).unwrap();
      nav("/confirm");
    } catch (err) {
      alert(typeof err === "string" ? err : "Có lỗi khi đặt tour, vui lòng thử lại");
    }
  };

  return (
    <div className="mx-4 md:mx-20 my-10">
      {(loading || stripeLoading) && <LoadingSpinner />}
      <h2 className="text-3xl md:text-4xl font-bold text-[#013879]">Tổng Quan Về Chuyến Đi</h2>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        <div className="w-full lg:w-2/3 mt-10">
          <Contacts orderByUser={orderByUser} setUserInfo={setUserInfo} />
          <div className="mt-10" />
          <PassengerCount adultCount={adultCount} childCount={childCount} setAdultCount={setAdultCount} setChildCount={setChildCount} />
          <div className="mt-10" />
          <GuestInfo adultCount={adultCount} childCount={childCount} guests={guests} setGuests={setGuests} firstPassengerName={userInfo.name} />
          <div className="mt-10" />
          <TakeNote setUserNote={setUserNote} />
          <div className="mt-5" />
          <Agree agree={agree} setAgree={setAgree} />
          <div className="mt-10" />
          <Payment selectedPayment={selectedPayment} setSelectedPayment={setPayment} />
        </div>

        <div className="w-full lg:w-1/3 h-auto mt-0 lg:mt-10 bg-white shadow-lg p-6 md:p-9">
          <PayBox orderByUser={orderByUser} adultCount={adultCount} childCount={childCount} Total={Total} handleCart={handleCart} />
        </div>
      </div>
    </div>
  );
};

const Booking = () => (
  <Elements stripe={stripePromise}>
    <BookingContent />
  </Elements>
);

export default Booking;
