import { useQuery } from '@tanstack/react-query';
import type { Wine } from '../../models/wines';
import { pb } from './client';

export const useWines = () => {
  return useQuery({
    queryKey: ['wines'],
    queryFn: async () => {
      // getFullList pages through every record; getList stops at the first 30
      const items = await pb.collection('wines').getFullList();
      return items as unknown as Wine[];
    },
  });
};
