import { useQuery } from "@tanstack/react-query";

import { pb } from "./client";
import type { Album } from "../../models/albums";

export const useAlbums = () => {
  return useQuery({
    queryKey: ["albums"],
    queryFn: async () => {
      const result = await pb.collection("albums").getList();
      console.log("Fetched albums:", result.items);

      const url = pb.files.getURL(result.items[0], result.items[0].images[0]);

      console.log("URL",url);

      return result.items as unknown as Album[];
    },
  });
};