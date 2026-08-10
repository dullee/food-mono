import mongoose from "mongoose";

async function testCategoryRoute() {
  try {
    console.log("--- Sending Request ---");

    const response = await fetch("http://localhost:8000/user", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: "6a74052c0cebb0f4dbc2565c", // Use a valid ID from your DB
        email: "funny@gmail.com",
      }),
    });

    // Get response as text first to avoid JSON parse crashes on HTML errors
    const text = await response.text();

    if (!response.ok) {
      console.error(`HTTP Error ${response.status}:`);
      console.error(text); // THIS WILL SHOW YOU THE EXACT HTML / ERROR MESSAGE
      return;
    }

    const data = JSON.parse(text);
    console.log("Success! Response Data:", data);
  } catch (error) {
    console.error("Fetch failed:", error.message);
  }
}

testCategoryRoute();
