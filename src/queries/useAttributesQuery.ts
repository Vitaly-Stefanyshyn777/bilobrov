
import { API_URL_BASE, consumerKey, consumerSecret } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";


export const useAttributesQuery = () => {
  return useQuery({
    queryKey: ["attributes"],
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL_BASE}response/v1/attributes`,
        {
          headers: {
            Authorization: "Basic " + btoa(`${consumerKey}:${consumerSecret}`),
          },
        }
      );
      return response.data;
    },
  });
};
