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

  const [resetPassword, SetResetPassword] = useState<boolean>(false);

  return (
    <div className="w-full max-w-md mx-auto ">
      {!resetPassword && (
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
                <div>
                  <Button
                    onClick={() => SetResetPassword(true)}
                    className={"underline bg-0 p-0 text-black"}
                  >
                    Forgot Password?
                  </Button>
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
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email format")
              .required("Email is required"),
          })}
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            try {
              await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/check-email`, {
                email: values.email,
              });
            } catch (error: any) {
              const errorMsg =
                error.response?.data?.error ||
                "Email already registered or server error.";
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
    </div>
  );
}
