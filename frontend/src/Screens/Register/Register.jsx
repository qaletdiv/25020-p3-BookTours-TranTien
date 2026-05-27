import { Formik, Form, Field, ErrorMessage } from "formik";

import * as Yup from "yup";

import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../redux/slices/authSlice";

const RegisterSchema = Yup.object({
  name: Yup.string().required("Vui lòng nhập họ và tên"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Số điện thoại phải gồm đúng 10 chữ số")
    .required("Vui lòng nhập số điện thoại"),
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  password: Yup.string()
    .min(6, "Mật khẩu tối thiểu 6 ký tự")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"
    )
    .required("Vui lòng nhập mật khẩu"),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref("password")], "Mật khẩu không khớp")
    .required("Vui lòng nhập lại mật khẩu"),
});

const Register = () => {
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(
        register({
          email: values.email,
          password: values.password,
          name: values.name,
          phone: values.phone,
        })
      ).unwrap();

      navigate("/dang-nhap");
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-[600px] bg-white my-10">

        {/* Logo */}
        <div className="w-[180px] h-auto mx-auto my-6">
          <img
            src="https://www.luavietours.com/assets/img/common/logo.jpg"
            alt="logo"
            className="w-full h-full object-contain"
          />
        </div>

        <Formik
          initialValues={{
            name: "",
            phone: "",
            email: "",
            password: "",
            passwordConfirm: "",
          }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form
              className="
                w-full
                px-6 sm:px-10
                py-8
                shadow-[0_4px_15px_rgba(0,0,0,0.1),_0_2px_5px_rgba(0,0,0,0.08)]
                mx-auto
              "
            >
              <h2 className="mb-6 text-3xl font-bold text-[#013879] text-center">
                Đăng Ký
              </h2>

              {/* Họ tên */}
              <div className="flex flex-col mb-4">
                <label className="font-bold">Họ và tên *</label>
                <Field
                  name="name"
                  type="text"
                  disabled={loading}
                  placeholder="Họ và tên"
                  className="py-3 focus:outline-none"
                />
                <div className="w-full h-[1.25px] bg-black"></div>
                <ErrorMessage
                  name="name"
                  component="p"
                  className="mt-1 text-xs text-red-500"
                />
              </div>

              {/* Số điện thoại */}
              <div className="flex flex-col mb-4">
                <label className="font-bold">Số điện thoại *</label>
                <Field
                  name="phone"
                  type="text"
                  disabled={loading}
                  placeholder="Số điện thoại"
                  className="py-3 focus:outline-none no-spin"
                />
                <div className="w-full h-[1.5px] bg-black"></div>
                <ErrorMessage
                  name="phone"
                  component="p"
                  className="mt-1 text-xs text-red-500"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col mb-4">
                <label className="font-bold">Email *</label>
                <Field
                  name="email"
                  type="email"
                  disabled={loading}
                  placeholder="Email"
                  className="py-3 focus:outline-none"
                />
                <div className="w-full h-[1.75px] bg-black"></div>
                <ErrorMessage
                  name="email"
                  component="p"
                  className="mt-1 text-xs text-red-500"
                />
              </div>

              {/* Mật khẩu */}
              <div className="flex flex-col mb-4">
                <label className="font-bold">Mật khẩu *</label>
                <Field
                  name="password"
                  type="password"
                  disabled={loading}
                  placeholder="Mật khẩu"
                  className="py-3 focus:outline-none"
                />
                <div className="w-full h-[1.75px] bg-black"></div>
                <ErrorMessage
                  name="password"
                  component="p"
                  className="mt-1 text-xs text-red-500"
                />
              </div>

              {/* Nhập lại mật khẩu */}
              <div className="flex flex-col mb-4">
                <label className="font-bold">Nhập lại mật khẩu *</label>
                <Field
                  name="passwordConfirm"
                  type="password"
                  disabled={loading}
                  placeholder="Nhập lại mật khẩu"
                  className="py-3 focus:outline-none"
                />
                <div className="w-full h-[1.75px] bg-black"></div>
                <ErrorMessage
                  name="passwordConfirm"
                  component="p"
                  className="mt-1 text-xs text-red-500"
                />
              </div>

              <div className="text-center mt-6">
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <button
                  type="submit"
                  disabled={loading || isSubmitting}
                  className="button w-full sm:w-auto px-10"
                >
                  {loading ? "Đang check..." : "Đăng Ký"}
                </button>
              </div>

              <p className="text-xs text-center mt-4">
                Đã có tài khoản?{" "}
                <Link to="/dang-nhap">
                  <span className="italic text-[#013879]">Đăng Nhập</span>
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
