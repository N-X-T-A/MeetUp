import React, { useState, useEffect } from "react";
import axios from "axios";

export const useExternalIP = (): string => {
  const [externalIP, setExternalIP] = useState<string>("");

  useEffect(() => {
    const fetchExternalIP = async () => {
      try {
        const response = await axios.get("/api/getExternalIP");
        const externalURL = response.data.externalURL;
        setExternalIP(externalURL);
      } catch (error) {
        console.error("Error fetching external IP:", error);
      }
    };

    fetchExternalIP();

    return () => {};
  }, []);

  return externalIP;
};
