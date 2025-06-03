export const handleApiResponse = async (
  response,
  defaultErrorMessage = "!خطایی در ارتباط با سرور رخ داد"
) => {
  let responseData;

  try {
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      let text = await response.text();
      if (response.ok)
        return text;
      throw new Error(`${text || defaultErrorMessage}`)
    }
  } catch (e) {
    throw new Error(`${e.message || defaultErrorMessage} : ${response.status}`);
  }

  if (
    responseData &&
    responseData.success === false &&
    Array.isArray(responseData.data)
  ) {
    const errors = responseData.data
      .map((item) => `${item?.errors.join(", ")}:${item?.rowNumber} سطر`)
      .join("\n");
    throw new Error(errors || "!عملیات انجام نشد");
  }

  if (!response.ok) {
    if (responseData?.errors && typeof responseData.errors === "object") {
      const validationErrors = Object.keys(responseData.errors)
        .map((key) => {
          const messages = responseData.errors[key].join(", ");
          return `${key}: ${messages}`;
        })
        .join("\n");
      throw new Error(validationErrors);
    }

    if (responseData?.message) {
      throw new Error(responseData.message);
    }

    throw new Error(responseData.message || "!عملیات انجام نشد");
  }

  return responseData;
};
