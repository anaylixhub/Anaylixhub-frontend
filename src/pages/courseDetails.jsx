import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants.jsx";
import { useSelector } from "react-redux";

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUserSubscribed, setIsUserSubscribed] = useState(false);
  const user = useSelector((state) => state.user);

  // ----------------------
  // CHECK SUBSCRIPTION STATUS
  // ----------------------
  const verifyUserSubscription = async () => {
    try {
      const res = await axios.get(BASE_URL + "/premium/verify", {
        withCredentials: true,
      });

      if (res.data.isSubscribed) {
        setIsUserSubscribed(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ----------------------
  // FETCH COURSE + CHECK SUBSCRIPTION
  // ----------------------
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/course/${id}`);
        setCourse(res.data);

        if (!user) {
          setIsUserSubscribed(false);
          setLoading(false);
          return;
        }

        await verifyUserSubscription();
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, user]);

  // ----------------------
  // HANDLE BUY BUTTON
  // ----------------------
  const handleBuy = async () => {
    const order = await axios.post(
      BASE_URL + "/payment/create",
      {},
      { withCredentials: true }
    );

    const { amount, keyId, currency, notes, orderId } = order.data;

    const options = {
      key: keyId,
      amount,
      currency,
      name: "Anaylixhub",
      description: "Subscription Payment",
      order_id: orderId,
      prefill: {
        name: notes.fullName,
        email: user?.emailId || "example@gmail.com",
        contact: user?.mobile || "0000000000",
      },
      theme: { color: "#F37254" },
      handler: verifyUserSubscription,
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (!course) return <p>Course not found.</p>;

  return (
    <div className="bg-gray-100 min-h-screen pt-10 pb-10">
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* Trailer */}
          <div className="w-full h-[350px] bg-gray-200 rounded-xl overflow-hidden shadow-sm border">
            {course.trailerVideo ? (
              <video
                src={course.trailerVideo}
                autoPlay
                muted
                playsInline
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <img src={course.thumbnail} className="w-full h-full object-cover" />
            )}
          </div>

          {/* About */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-2xl font-bold mb-3">About this course</h2>
            <p>{course.fullDescription}</p>
          </div>

        </div>

        {/* RIGHT */}
        <div className="bg-white shadow-md rounded-xl p-6 h-fit sticky top-24 border">

          {/* TITLE */}
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-purple-600 mt-1">{course.category}</p>

          {/* BUY / START */}
          <div className="mt-5">
            {!isUserSubscribed ? (
              <button
                onClick={handleBuy}
                className="px-6 py-3 bg-blue-600 text-white rounded-full"
              >
                Buy Now
              </button>
            ) : (
              <Link
                to={`/learn/${course._id}`}
                className="px-6 py-3 bg-green-600 text-white rounded-full"
              >
                Start Learning →
              </Link>
            )}
          </div>

          {/* MODULES */}
          <h2 className="text-xl font-bold mt-8 mb-4">Course Content</h2>

          {course.modules?.map((mod, i) => (
            <div key={i} className="mb-6">
              <h3 className="font-semibold text-lg mb-2">
                {i + 1}. {mod.moduleTitle}
              </h3>

              <ul className="space-y-2">
                {mod.lectures.map((lec, j) => (
                  <li className="p-3 bg-gray-100 rounded">
                    {j + 1}. {lec.title} • {lec.duration}
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
