import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../../utils/userSlice.jsx";
import { BASE_URL } from "../../utils/constants.jsx";
import useRazorpayPayment from "../../hooks/useRazorpayPayment";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const startPayment = useRazorpayPayment();

  const [user, setUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState(""); // ⭐ NEW ERROR STATE
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    emailId: "",
    confirmEmail: "",
    mobile: "",
    state: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMsg(""); // ⭐ CLEAR ERROR WHEN TYPING
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Client-Side Validations
    if (form.emailId !== form.confirmEmail) {
      return setErrorMsg("Email and Confirm Email do not match.");
    }
    if (form.password !== form.confirmPassword) {
      return setErrorMsg("Password and Confirm Password do not match.");
    }

    try {
      setLoading(true);

      // Register user
      await axios.post(`${BASE_URL}/auth/register`, form, {
        withCredentials: true,
      });

      // Fetch logged-in user
      const resUser = await axios.get(`${BASE_URL}/profile/view`, {
        withCredentials: true,
      });

      const freshUser = resUser.data;
      setUser(freshUser);
      dispatch(addUser(freshUser));

      // Auto Start Razorpay Pay
      startPayment(
        freshUser,
        () => navigate("/payment-status?success=true"),
        () => navigate("/payment-status?success=false")
      );

    } catch (err) {
      const message =
        err.response?.data?.message || "Something went wrong during signup.";
      setErrorMsg(message); // ⭐ SHOW BACKEND ERROR
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-50 pt-10">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-xl shadow-xl mt-10">

        <h2 className="text-3xl font-bold">Create Your Account</h2>

        {/* ⭐ ERROR MESSAGE BOX */}
        {errorMsg && (
          <p className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mt-4">
            {errorMsg}
          </p>
        )}

        <form className="space-y-5 mt-6" onSubmit={handleSubmit}>

          {/* FULL NAME */}
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full"
            placeholder="Full Name"
            required
          />

          {/* EMAIL + CONFIRM EMAIL */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="emailId"
              value={form.emailId}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              placeholder="Email"
              required
            />

            <input
              name="confirmEmail"
              value={form.confirmEmail}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              placeholder="Confirm Email"
              required
            />
          </div>

          {/* MOBILE */}
          <input
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full"
            placeholder="Mobile Number"
            required
          />

          {/* STATE */}
          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full"
            required
          >
            <option value="">Select State</option>
            <option value="Delhi">Delhi</option>
            <option value="UP">Uttar Pradesh</option>
            <option value="MH">Maharashtra</option>
            <option value="RJ">Rajasthan</option>
          </select>

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full"
            placeholder="Password"
            required
          />

          {/* CONFIRM PASSWORD */}
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full"
            placeholder="Confirm Password"
            required
          />

          {/* SUBMIT BUTTON */}
          <button
            disabled={loading}
            className="bg-purple-600 text-white py-3 px-6 rounded-full w-full disabled:bg-gray-400"
          >
            {loading ? "Please wait..." : "Sign Up →"}
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="mt-4 text-gray-700 text-center">
          Already have an account?
          <Link to="/login" className="text-blue-600 ml-1 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
