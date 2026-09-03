"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LogInForm() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>("");

  const [resetPassword, setResetPassword] = useState<boolean>(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto ">
      {!resetPassword && !showResetForm && (
        <Formik
          initialValues={{ email: userEmail, password: "" }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email format")
              .required("Email is required"),
            password: Yup.string().required("Password is required"),
          })}
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            try {
              const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/user/login`,
                {
                  email: values.email,
                  password: values.password,
                },
                {
                  withCredentials: true, // Crucial step so the backend JWT cookie gets saved!
                },
              );
              const { role } = response.data.user;
              if (role === "ADMIN") {
                router.push("/admin");
              } else {
                router.push("/");
              }
              setUserEmail(values.email);
            } catch (error: any) {
              // Catch errors matching your backend messaging patterns
              const errorMsg =
                error.response?.data?.message || "Invalid email or password.";
              setFieldError("email", errorMsg);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isValid, dirty, isSubmitting }) => (
            <Form className="flex flex-col gap-4 ">
              <h2 className="text-xl font-bold">Log in</h2>
              <p className="text-sm text-gray-600">
                Log in to enjoy your favorite dishes.
              </p>

              <div className="flex flex-col gap-1">
                <Field
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="border px-3 py-2 rounded-md"
                />
                <ErrorMessage
                  name="email"
                  component="span"
                  className="text-red-500 text-xs"
                />
                <Field
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="border px-3 py-2 rounded-md"
                />
                <ErrorMessage
                  name="password"
                  component="span"
                  className="text-red-500 text-xs"
                />
                <div
                  onClick={() => setResetPassword(true)}
                  className={"underline text-black hover:bg-none"}
                >
                  Forgot Password?
                </div>
              </div>

              <Button
                type="submit"
                disabled={!isValid || !dirty || isSubmitting}
                className="bg-black text-white py-2 rounded-md"
              >
                {isSubmitting ? "Checking..." : "Continue"}
              </Button>
            </Form>
          )}
        </Formik>
      )}
      {resetPassword && (
        <Formik
          initialValues={{ email: userEmail }}
          enableReinitialize
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email format")
              .required("Email is required"),
          })}
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            try {
              const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/user/check-email`,
                {
                  email: values.email,
                },
              );
              if (!res.data.emailTaken) {
                setFieldError("email", "Email is not connected to account");
                return;
              }

              setUserEmail(values.email);
              setShowResetForm(true);
              setResetPassword(false);
            } catch (error: any) {
              const errorMsg = error.response?.data?.error || "Server error.";
              setFieldError("email", errorMsg);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isValid, dirty, isSubmitting }) => (
            <Form className="flex flex-col gap-4 ">
              <h2 className="text-xl font-bold">Reset your password</h2>
              <p className="text-sm text-gray-600">
                Enter your email to recieve a password reset link.
              </p>

              <div className="flex flex-col gap-1">
                <Field
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="border px-3 py-2 rounded-md"
                />
                <ErrorMessage
                  name="email"
                  component="span"
                  className="text-red-500 text-xs"
                />
              </div>
              <Button
                type="submit"
                disabled={!isValid || !dirty || isSubmitting}
                className="bg-black text-white py-2 rounded-md"
              >
                {isSubmitting ? "Checking..." : "Continue"}
              </Button>
            </Form>
          )}
        </Formik>
      )}
      {showResetForm && (
        <Formik
          initialValues={{ newPassword: "", confirmPassword: "" }}
          validationSchema={Yup.object({
            newPassword: Yup.string()
              .min(6, "Password must be at least 6 characters")
              .required("New password is required"),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref("newPassword")], "Passwords must match")
              .required("Confirm password is required"),
          })}
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            try {
              await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/user/change-password`,
                {
                  email: userEmail,
                  newPassword: values.newPassword,
                },
              );

              setShowResetForm(false);
              setResetPassword(false);
            } catch (error: any) {
              const errorMsg = error.response?.data?.error || "server error.";
              setFieldError("confirmPassword", errorMsg);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isValid, dirty, isSubmitting }) => (
            <Form className="flex flex-col gap-4 ">
              <h2 className="text-xl font-bold">Create new password</h2>
              <p className="text-sm text-gray-600">
                Set a new password with a combination of letters and numbers for
                better security.
              </p>
              <div className="flex flex-col gap-1">
                <Field
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="border px-3 py-2 rounded-md"
                />
                <ErrorMessage
                  name="newPassword"
                  component="span"
                  className="text-red-500 text-xs"
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className="relative flex items-center">
                  <Field
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm "
                    className="border px-3 py-2 pr-10 rounded-md w-full"
                  />
                </div>
                <ErrorMessage
                  name="confirmPassword"
                  component="span"
                  className="text-red-500 text-xs"
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={"outline"}
                    onClick={() => setShowPassword(!showPassword)}
                    className={`w-3.5 h-6 rounded-md ${showPassword && "bg-black text-white"} text-gray-500 hover:text-gray-700`}
                  >
                    {showPassword && <Check size={14} />}
                  </Button>
                  <span>Show password</span>
                </div>
              </div>
              <Button
                type="submit"
                disabled={!isValid || !dirty || isSubmitting}
                className="bg-black text-white py-2 rounded-md"
              >
                {isSubmitting ? "Checking..." : "Continue"}
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}
