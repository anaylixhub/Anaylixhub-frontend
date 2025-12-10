import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import  useRazorpayPayment  from "../hooks/useRazorpayPayment";

const PaymentStart = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const startPayment = useRazorpayPayment(
  user,
  () => navigate("/payment-status?success=true"),
  () => navigate("/payment-status?success=false")
);

  useEffect(() => {
    if (!user) return;   // Wait until redux user is available

    startPayment();       // Now Razorpay will open properly
  }, [user,navigate,startPayment]);

  return <p className="text-center mt-10">Starting Payment...</p>;
};

export default PaymentStart;
