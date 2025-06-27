import { API_URL_WC, consumerKey, consumerSecret } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useCertificatesQuery = () => {
  return useQuery({
    queryKey: ["certificates"],
    queryFn: async () => {
      const params = new URLSearchParams({
        per_page: "100",
        category: "1159",
      });

      const url = `${API_URL_WC}products?${params.toString()}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: "Basic " + btoa(`${consumerKey}:${consumerSecret}`),
        },
      });

      return response.data;
    },
  });
};
