import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

export const useBrandsQuery = () => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await axiosInstance.get("products/brands");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
