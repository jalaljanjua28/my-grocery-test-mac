// DataService.js
const baseUrl = "http://127.0.0.1:8081";

export async function fetchMasterExpiredData() {
  try {
    const response = await fetch(baseUrl + "/api/get-master-expired", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data.");
    }
    const data = await response.json();
    // Process data as needed
    const processedData = processData(data);
    return processedData;
  } catch (error) {
    console.error("Error fetching master expired data:", error);
    throw error;
  }
}
export async function fetchShoppingListData() {
  try {
    const response = await fetch(baseUrl + "/api/get-shopping-list", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch data.");
    }
    const data = await response.json();
    // Process data as needed
    const processedData = processData(data);
    return processedData;
  } catch (error) {
    console.error("Error fetching shopping list data:", error);
    throw error;
  }
}
export async function fetchMasterNonexpiredData() {
  try {
    const response = await fetch(baseUrl + "/api/get-master-nonexpired", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data.");
    }
    const data = await response.json();
    // Process data as needed
    const processedData = processData(data);
    return processedData;
  } catch (error) {
    console.error("Error fetching master nonexpired data:", error);
    throw error;
  }
}
export async function fetchPurchasedListData() {
  try {
    const response = await fetch(baseUrl + "/api/get-purchase-list", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch data.");
    }
    const data = await response.json();
    // Process data as needed
    const processedData = processData(data);
    return processedData;
  } catch (error) {
    console.error("Error fetching master nonexpired data:", error);
    throw error;
  }
}
function processData(data) {
  try {
    const base64Data = data.data;
    const binaryData = new Uint8Array(
      [...atob(base64Data)].map((char) => char.charCodeAt(0))
    );
    const textDecoder = new TextDecoder();
    const decodedData = textDecoder.decode(binaryData);
    const parsedData = JSON.parse(decodedData);

    // Process Food data
    const Food = parsedData.Food.filter((item) => item.Name !== "TestFNE").map(
      (item, index) => ({
        id: index,
        name: item.Name,
        image: item.Image,
        date: item.Date,
        expiry: item.Expiry_Date,
        price: item.Price,
        status: item.Status,
        days_left: item.Days_Until_Expiry,
      })
    );
    // Process NonFood data
    const NonFood = parsedData.Not_Food.filter(
      (item) => item.Name !== "TestFNE"
    ).map((item, index) => ({
      id: index,
      name: item.Name,
      image: item.Image,
      date: item.Date,
      price: item.Price,
      status: item.Status,
      days_left: item.Days_Until_Expiry,
    }));
    return {
      Food_expired: Food,
      NonFood_expired: NonFood,
      Food_nonexpired: Food,
      NonFood_nonexpired: NonFood,
      Food: Food,
      NonFood: NonFood,
    };
  } catch (error) {
    console.error("Error processing data:", error);
    throw error;
  }
}
