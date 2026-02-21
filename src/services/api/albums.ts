import { useQuery } from '@tanstack/react-query';

import { pb } from './client';
import type { Album } from '../../models/albums';

const normalizeAlbum = (record: any): Album => {
  return {
    id: String(record?.id ?? ''),
    collectionId: typeof record?.collectionId === 'string' ? record.collectionId : undefined,
    collectionName: typeof record?.collectionName === 'string' ? record.collectionName : undefined,
    title: String(record?.title ?? ''),
    date: String(record?.date ?? ''),
    images: Array.isArray(record?.images) ? record.images : [],
    files: Array.isArray(record?.files) ? record.files : [],
  };
};

export const useAlbums = () => {
  return useQuery({
    queryKey: ['albums'],
    queryFn: async () => {
      const result = await pb.collection('albums').getList();
      return result.items.map(normalizeAlbum);
    },
  });
};

export const useAlbum = (id: string | undefined) => {
  return useQuery({
    queryKey: ['albums', id],
    queryFn: async () => {
      if (!id) throw new Error('No album id');

      try {
        const result = await pb.collection('albums').getOne(id);
        return normalizeAlbum(result);
      } catch (err: any) {
        // If the collection requires superuser for getOne, try a filtered getList as fallback
        const msg = err?.message ?? '';
        if (typeof msg === 'string' && msg.toLowerCase().includes('superuser')) {
          const list = await pb.collection('albums').getList(1, 50, { filter: `id = "${id}"` });
          if (list?.items && list.items.length > 0) return normalizeAlbum(list.items[0]);
        }

        throw err;
      }
    },
  });
};
