import { useQuery } from '@tanstack/react-query';
import type { Event } from '../../models/event';
import { pb } from './client';

const normalizeEvent = (record: any): Event => {
  return {
    id: typeof record?.id === 'string' ? record.id : undefined,
    title: String(record?.title ?? ''),
    description: String(record?.description ?? ''),
    location: String(record?.location ?? ''),
    startDate: String(record?.startDate ?? ''),
    endDate: String(record?.endDate ?? ''),
    album: typeof record?.album === 'string' ? record.album : undefined,
  };
};

export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const result = await pb.collection('calendar').getList(1, 200);
      return result.items.map(normalizeEvent);
    },
  });
};
