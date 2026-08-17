import mongoose from "mongoose";

async function testCategoryRoute() {
  try {
    console.log("--- Sending Request ---");

    const response = await fetch(
      "http://localhost:8000/user/6a7b118c84eb2ca1fa913fdc",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({
        //   // user: "6a74052c0cebb0f4dbc2565c",
        //   email: "dulgun@gmail.com",
        //   password: "funny123go",
        // }),
      },
    );

    // Get response as text first to avoid JSON parse crashes on HTML errors
    const text = await response.text();

    if (!response.ok) {
      console.error(`HTTP Error ${response.status}:`);
      console.error(text); // THIS WILL SHOW YOU THE EXACT HTML / ERROR MESSAGE
      return;
    }

    const data = JSON.parse(text);
    console.log("Success! Response Data:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Fetch failed:", error.message);
  }
}

testCategoryRoute();
