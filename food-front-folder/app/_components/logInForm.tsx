"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";

export default function LogInForm() {
  // Track current step (1 = Email Check, 2 = Password/Details, 3 = Complete)
  const [step, setStep] = useState<number>(1);
  const [userEmail, setUserEmail] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [resetPassword, SetResetPassword] = useState<boolean>(false);

  return (
    <div className="w-full max-w-md mx-auto ">
      {step === 1 && !resetPassword && (
        <Formik
          initialValues={{ email: userEmail }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email format")
              .required("Email is required"),
          })}
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            try {
              // 1. Check with backend if email is free
              await axios.post("http://localhost:4000/api/users/check-email", {
                email: values.email,
              });

              // 2. Email is available! Store it and advance to Step 2
              setUserEmail(values.email);
              setStep(2);
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
              // 1. Check with backend if email is free
              await axios.post("http://localhost:4000/api/users/check-email", {
                email: values.email,
              });

              // 2. Email is available! Store it and advance to Step 2
              setUserEmail(values.email);
              setStep(2);
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
