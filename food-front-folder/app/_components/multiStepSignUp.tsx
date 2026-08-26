"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { User } from "@/app/types/user";

export default function MultiStepSignup() {
  // Track current step (1 = Email Check, 2 = Password/Details, 3 = Complete)
  const [step, setStep] = useState<number>(1);
  const [userEmail, setUserEmail] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="w-full max-w-md mx-auto ">
      {/* ------------------------------------------------------------------ */}
      {/* STEP 1: EMAIL CHECK FORM                                           */}
      {/* ------------------------------------------------------------------ */}
      {step === 1 && (
        <Formik
          initialValues={{ email: userEmail }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email format")
              .required("Email is required"),
          })}
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            try {
              const response = await axios.post<{ emailTaken: boolean }>(
                `${process.env.NEXT_PUBLIC_API_URL}/user/check-email`,
                { email: values.email },
              );

              if (response.data.emailTaken) {
                setFieldError("email", "Email already registered.");
                return;
              }
              setUserEmail(values.email);
              setStep(2);
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
              <h2 className="text-xl font-bold">Create your account</h2>
              <p className="text-sm text-gray-600">
                Enter your email to get started.
              </p>

              <div className="flex flex-col gap-1">
                <Field
                  name="email"
                  type="email"
                  placeholder="Email"
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

      {/* ------------------------------------------------------------------ */}
      {/* STEP 2: PASSWORD & FINAL SIGNUP                                   */}
      {/* ------------------------------------------------------------------ */}
      {step === 2 && (
        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={Yup.object({
            password: Yup.string()
              .min(6, "Password must be at least 6 characters")
              .required("Password is required"),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref("password")], "Passwords must match")
              .required("Please confirm your password"),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
                email: userEmail,
                password: values.password,
              });
              setStep(3);
            } catch (error) {
              alert("Failed to create account. Please try again.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isValid, dirty, isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Set your password</h2>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-blue-600 underline"
                >
                  Change Email
                </button>
              </div>

              <p className="text-sm text-gray-500">
                Signing up as <b>{userEmail}</b>
              </p>

              <div className="flex flex-col gap-3">
                {/* PASSWORD INPUT WITH TOGGLE */}
                <div className="flex flex-col gap-1">
                  <div className="relative flex items-center">
                    <Field
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="border px-3 py-2 pr-10 rounded-md w-full"
                    />
                  </div>
                  <ErrorMessage
                    name="password"
                    component="span"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* CONFIRM PASSWORD INPUT WITH TOGGLE */}
                <div className="flex flex-col gap-1">
                  <div className="relative flex items-center">
                    <Field
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm Password"
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
                      className={`w-3.5 rounded-md ${showPassword && "bg-black text-white"} text-gray-500 hover:text-gray-700`}
                    >
                      {showPassword && <Check size={14} />}
                    </Button>
                    <span>Show password</span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={!isValid || !dirty || isSubmitting}
                className="bg-black text-white py-2 rounded-md disabled:bg-gray-300 disabled:text-gray-500 disabled:opacity-100"
              >
                {isSubmitting ? "Creating Account..." : "Let's Go"}
              </Button>
            </Form>
          )}
        </Formik>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* STEP 3: SUCCESS / WELCOME SCREEN                                  */}
      {/* ------------------------------------------------------------------ */}
      {step === 3 && (
        <div className="flex flex-col items-center gap-4 text-center py-6">
          <h2 className="text-2xl font-bold text-green-600">
            🎉 Account Created!
          </h2>
          <p>Welcome! Your account has been saved to MongoDB.</p>
        </div>
      )}
    </div>
  );
}
