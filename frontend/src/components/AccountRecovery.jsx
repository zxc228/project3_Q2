"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function AccountRecovery() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: false,
    code: false,
    newPassword: false,
    confirmPassword: false,
    api: "",
  });

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("recoverEmail");
    if (storedEmail) {
      setFormData((prev) => ({ ...prev, email: storedEmail }));
    }
  }, []);

  const passwordRegex = /^[a-zA-Z0-9]{7,}$/;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: false, api: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      email: !formData.email,
      code: formData.code.length !== 6,
      newPassword: !passwordRegex.test(formData.newPassword),
      confirmPassword: formData.newPassword !== formData.confirmPassword,
      api: "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((val) => val)) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          code: formData.code,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors((prev) => ({ ...prev, api: data.error || "Reset failed" }));
      } else {
        toast.success("Password successfully changed!");
        router.push("/login");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Reset password error:", error);
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
          priority
          className="max-h-full object-contain w-full"
        />
      </div>

      <div className="w-1/2 flex flex-col justify-center items-center bg-white px-16">
        <div className="text-center mb-10">
          <h1 className="text-[36px] font-montserrat font-[900] text-[#14192C] leading-[42px]">
            Reset your password
          </h1>
          <p className="mt-2 font-montserrat font-semibold text-[18px] text-gray-600">
            Enter the 6-digit code and choose a new password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-[562px]">
          {["email", "code", "newPassword", "confirmPassword"].map((field) => (
            <div className="mb-8" key={field}>
              <input
                type={field.toLowerCase().includes("password") ? "password" : "text"}
                name={field}
                placeholder={
                  field === "email"
                    ? "Your U-TAD email"
                    : field === "code"
                    ? "6-digit recovery code"
                    : field === "newPassword"
                    ? "New password"
                    : "Repeat new password"
                }
                value={formData[field]}
                onChange={handleInputChange}
                className={`w-full border-b-4 py-2 px-3 font-montserrat text-[24px] focus:outline-none ${
                  errors[field] ? "border-red-500" : "border-[#0065EF]"
                } text-[#6F7276] font-bold`}
              />
              {errors[field] && (
                <p className="text-red-500 text-sm mt-1">
                  {field === "code"
                    ? "*Code must be 6 digits"
                    : field === "newPassword"
                    ? "*Min. 7 characters, only letters/numbers"
                    : field === "confirmPassword"
                    ? "*Passwords do not match"
                    : "*This field is required"}
                </p>
              )}
            </div>
          ))}

          {errors.api && (
            <p className="text-red-500 text-[16px] font-semibold mb-4">
              {errors.api}
            </p>
          )}

          <div className="flex justify-center mt-6">
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
  );
}
