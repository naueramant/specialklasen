import { useQuery } from "@tanstack/react-query";
import type { Wine } from "../../models/wines";
import { pb } from "./client";

export const useWines = () => {
  return useQuery({
    queryKey: ["wines"],
    queryFn: async () => {
      const result = await pb.collection("wines").getList();
      return result.items as unknown as Wine[];
    },
  });
};
