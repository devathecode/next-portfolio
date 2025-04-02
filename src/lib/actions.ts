"use server";
export async function contactSubmit(
  formData: FormData
): Promise<string | null> {
  try {
    const response = await fetch(
      "https://dev-cms-backend.vercel.app/api/v1/crud/",
      {
        headers: {
          origin: "http://localhost:3000",
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "numeric",
            minute: "numeric",
          }),
        }),
      }
    );
    await response.json();
    return "/thankyou";
  } catch (error) {
    console.log("error", error);
    return null;
  }
}
