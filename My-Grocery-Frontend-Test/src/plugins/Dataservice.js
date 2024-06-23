// DataService.js
import { auth } from "../Firebase.js";
import { onAuthStateChanged } from "firebase/auth"; // Correctly import onAuthStateChanged from firebase/auth

const baseUrl = "http://127.0.0.1:8081";

// export async function checkAuth() {
//   onAuthStateChanged(auth, (user) => {
//     if (user) {
//       this.currentUser = user;
//       console.log("User is logged in:", user);
//     } else {
//       console.log("No user is logged in");
//     }
//   });
// }

export async function fetchMasterExpiredData() {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken(/* forceRefresh */ true);
          console.log("idToken", idToken);
          const response = await fetch(baseUrl + "/api/get-master-expired", {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch data.");
          }

          const data = await response.json();
          const processedData = processData(data);
          resolve(processedData);
        } catch (error) {
          console.error("Error fetching master expired data:", error);
          reject(error);
        }
      } else {
        reject(new Error("User not authenticated"));
      }
    });
  });
}

export async function fetchShoppingListData() {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken(/* forceRefresh */ true);
          console.log("idToken", idToken);
          const response = await fetch(baseUrl + "/api/get-shopping-list", {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch data.");
          }

          const data = await response.json();
          const processedData = processData(data);
          resolve(processedData);
        } catch (error) {
          console.error("Error fetching shopping list data:", error);
          reject(error);
        }
      } else {
        reject(new Error("User not authenticated"));
      }
    });
  });
}
export async function fetchMasterNonexpiredData() {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken(/* forceRefresh */ true);
          console.log("idToken", idToken);
          const response = await fetch(baseUrl + "/api/get-master-nonexpired", {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch data.");
          }

          const data = await response.json();
          const processedData = processData(data);
          resolve(processedData);
        } catch (error) {
          console.error("Error fetching master nonexpired data:", error);
          reject(error);
        }
      } else {
        reject(new Error("User not authenticated"));
      }
    });
  });
}
export async function fetchPurchasedListData() {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken(/* forceRefresh */ true);
          console.log("idToken", idToken);
          const response = await fetch(baseUrl + "/api/get-purchased-list", {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch data.");
          }

          const data = await response.json();
          const processedData = processData(data);
          resolve(processedData);
        } catch (error) {
          console.error("Error fetching purchase list data:", error);
          reject(error);
        }
      } else {
        reject(new Error("User not authenticated"));
      }
    });
  });
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
