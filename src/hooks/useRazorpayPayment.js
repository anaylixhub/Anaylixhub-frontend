// useRazorpayPayment.js
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const useRazorpayPayment = () => {
  return async function startPayment(user, onSuccess, onFail) {
    if (!user) {
      console.log("User not logged in");
      return;
    }

    try {
      const res = await axios.post(
        BASE_URL + "/payment/create",
        {},
        { withCredentials: true }
      );

      const { orderId, amount, currency, keyId } = res.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "Anaylixhub",
        description: "Premium Subscription",
        order_id: orderId,

        prefill: {
          name: user.fullName,
          email: user.emailId,
          contact: user.mobile,
        },

        handler: (response) => {
          onSuccess();
        },

        modal: {
          ondismiss: onFail,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", onFail);
      rzp.open();

    } catch (err) {
      console.log("Payment Error:", err);
      onFail();
    }
  };
};

export default useRazorpayPayment;
