import { useQuery } from "@tanstack/react-query";
import type { Event } from "../../models/event";
import { pb } from "./client";

export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const result = await pb.collection("calendar").getList();
      return result.items as unknown as Event[];
    },
  });
};
