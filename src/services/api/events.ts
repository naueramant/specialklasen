import { useQuery } from '@tanstack/react-query';
import type { Event } from '../../models/event';
import { pb } from './client';

const pickSingleFileName = (value: unknown): string | undefined => {
  if (typeof value === 'string' && value.length > 0) return value;
  if (Array.isArray(value) && typeof value[0] === 'string' && value[0].length > 0) return value[0];
  return undefined;
};

const normalizeExpandedAlbum = (record: any): Event['albumExpanded'] | undefined => {
  if (!record || typeof record !== 'object') return undefined;

  const id = typeof record?.id === 'string' ? record.id : '';
  if (!id) return undefined;

  return {
    id,
    collectionId: typeof record?.collectionId === 'string' ? record.collectionId : undefined,
    collectionName: typeof record?.collectionName === 'string' ? record.collectionName : undefined,
    images: Array.isArray(record?.images) ? record.images : [],
    title: typeof record?.title === 'string' ? record.title : undefined,
    date: typeof record?.date === 'string' ? record.date : undefined,
  };
};

const normalizeEvent = (record: any): Event => {
  return {
    id: typeof record?.id === 'string' ? record.id : undefined,
    collectionId: typeof record?.collectionId === 'string' ? record.collectionId : undefined,
    collectionName: typeof record?.collectionName === 'string' ? record.collectionName : undefined,
    title: String(record?.title ?? ''),
    description: String(record?.description ?? ''),
    location: String(record?.location ?? ''),
    startDate: String(record?.startDate ?? ''),
    endDate: String(record?.endDate ?? ''),
    album: typeof record?.album === 'string' ? record.album : undefined,
    albumExpanded: normalizeExpandedAlbum(record?.expand?.album),
    coverFromAlbum: typeof record?.coverFromAlbum === 'string' ? record.coverFromAlbum : undefined,
    coverImage: pickSingleFileName(record?.coverImage ?? record?.cover),
  };
};

export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const result = await pb.collection('calendar').getList(1, 200, { expand: 'album' });
      return result.items.map(normalizeEvent);
    },
  });
};
