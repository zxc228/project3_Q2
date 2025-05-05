"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// TODO
export default function AccountRecovery() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const passwordRegex = /^[a-zA-Z0-9]{7,}$/;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      newPassword: !passwordRegex.test(formData.newPassword),
      confirmPassword: formData.newPassword !== formData.confirmPassword,
    };

    setErrors(newErrors);

    if (!Object.values(newErrors).includes(true)) {
      try {
        const res = await fetch("/api/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: formData.newPassword }),
        });

        if (!res.ok) {
          let errorMessage;
          try {
            const data = await res.json();
            errorMessage = data.error;
          } catch {
            errorMessage = "Failed to reset password";
          }
          alert(errorMessage);
        } else {
          alert("Password successfully changed!");
          router.push("/login");
        }
      } catch (error) {
        console.error("Reset password error:", error);
        alert("Failed to update password. Please try again.");
      }
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-custom-utad-logo flex justify-center items-center">
        <Image
          src="/u-tad-logo.png"
          alt="U-Tad Logo"
          width={700}
          height={600}
          priority={true}
          className="max-h-full object-contain w-full"
        />
      </div>

      <div className="w-1/2 flex flex-col justify-center items-center bg-white px-16">
        <div className="text-center mb-16">
          <h1 className="text-[36px] font-montserrat font-[900] text-[#14192C] leading-[42px]">
            Create a new password
          </h1>
        </div>

        <div className="w-full max-w-[562px]">
          <form onSubmit={handleSubmit}>
            <div className="mb-16">
              <input
                type="password"
                name="newPassword"
                placeholder="New password"
                value={formData.newPassword}
                onChange={handleInputChange}
                className={`w-full border-b-4 py-2 px-3 font-montserrat text-[24px] focus:outline-none ${
                  errors.newPassword ? "border-red-500" : "border-[#0065EF]"
                } text-[#6F7276] font-bold`}
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  *Password must be at least 7 characters long and contain only
                  letters and numbers*
                </p>
              )}
            </div>

            <div className="mb-16">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Repeat new password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full border-b-4 py-2 px-3 font-montserrat text-[24px] focus:outline-none ${
                  errors.confirmPassword ? "border-red-500" : "border-[#0065EF]"
                } text-[#6F7276] font-bold`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  *Passwords do not match*
                </p>
              )}
            </div>

            <div className="flex justify-center mt-10">
              <button
                type="submit"
                className="bg-[#0065EF] text-white font-montserrat font-bold text-[21px] py-[18px] px-16 rounded-lg uppercase leading-[21px] hover:bg-blue-700 transition-colors"
              >
                Create new password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
