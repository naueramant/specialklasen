import { QueryClient } from "@tanstack/react-query";
import PocketBase from "pocketbase";

const pb = new PocketBase();
const queryClient = new QueryClient();

export { pb, queryClient };
