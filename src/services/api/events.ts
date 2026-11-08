import { useQuery } from '@tanstack/react-query';
import type { Event } from '../../models/event';
import { pb } from './client';

export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      // getFullList pages through every record; getList stops at the first 30
      const items = await pb.collection('calendar').getFullList();
      return items as unknown as Event[];
    },
  });
};
