import { useQuery } from '@tanstack/react-query';

import { pb } from './client';
import type { Album } from '../../models/albums';

export const useAlbums = () => {
  return useQuery({
    queryKey: ['albums'],
    queryFn: async () => {
      // getFullList pages through every record; getList stops at the first 30
      const items = await pb.collection('albums').getFullList();
      return items as unknown as Album[];
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
        return result as unknown as Album;
      } catch (err: any) {
        // If the collection requires superuser for getOne, try a filtered getList as fallback
        const msg = err?.message ?? '';
        if (typeof msg === 'string' && msg.toLowerCase().includes('superuser')) {
          const list = await pb.collection('albums').getList(1, 50, { filter: `id = "${id}"` });
          if (list?.items && list.items.length > 0) return list.items[0] as unknown as Album;
        }

        throw err;
      }
    },
  });
};
