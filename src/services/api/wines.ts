import { useQuery } from '@tanstack/react-query';
import type { Wine } from '../../models/wines';
import { pb } from './client';

export const useWines = () => {
  return useQuery({
    queryKey: ['wines'],
    queryFn: async () => {
      const items = await pb.collection('wines').getFullList({ sort: '-created' });
      return items as unknown as Wine[];
    },
  });
};
