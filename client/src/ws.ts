import socketIOClient from "socket.io-client";
import axios from "axios";

export let WS = "";

// Hàm để lấy địa chỉ IP external
async function getExternalIP(): Promise<string | null> {
  try {
    const response = await axios.get("https://api.ipify.org?format=json");
    return response.data.ip;
  } catch (error) {
    console.error("Error fetching external IP:", error);
    return null;
  }
}

// Hàm cập nhật WS với địa chỉ external
async function updateWSWithExternalIP() {
  const externalIP = await getExternalIP();
  console.log(externalIP);
  if (externalIP) {
    WS = `https://${externalIP}:5000`;
    console.log("WS updated with external IP:", WS);
  } else {
    console.error("Unable to fetch external IP, WS remains unchanged.");
  }
}

// Gọi hàm để cập nhật WS
updateWSWithExternalIP();

// Khởi tạo kết nối socketIOClient với WS
export const ws = socketIOClient(WS);
