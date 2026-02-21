import React, { useEffect, useMemo, useState } from 'react';
import type { RecordModel } from 'pocketbase';
import { pb } from '../../services/api/client';
import type { Album } from '../../models/albums';

interface PocketbaseVideoProps {
  album: Album;
  fileName: string;
  className?: string;
  controls?: boolean;
  muted?: boolean;
  posterTimeSeconds?: number;
}

const useVideoPoster = (url: string | null, posterTimeSeconds: number) => {
  const [poster, setPoster] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!url) {
      setPoster(undefined);
      return;
    }

    let cancelled = false;
    const video = document.createElement('video');

    // Best-effort: if CORS/canvas is blocked, we just won't get a poster.
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.src = url;

    const cleanup = () => {
      video.removeAttribute('src');
      video.load();
    };

    const onLoadedMetadata = async () => {
      try {
        const duration = Number.isFinite(video.duration) ? video.duration : 0;
        const target = duration > 0 ? Math.min(Math.max(posterTimeSeconds, 0), Math.max(duration - 0.05, 0)) : posterTimeSeconds;
        video.currentTime = target;
      } catch {
        // ignore
      }
    };

    const onSeeked = () => {
      try {
        const w = video.videoWidth;
        const h = video.videoHeight;
        if (!w || !h) return;

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(video, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);

        if (!cancelled) setPoster(dataUrl);
      } catch {
        // If the canvas is tainted (CORS), poster generation fails.
      } finally {
        cleanup();
      }
    };

    const onError = () => {
      cleanup();
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', onError);

    return () => {
      cancelled = true;
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onError);
      cleanup();
    };
  }, [url, posterTimeSeconds]);

  return poster;
};

const PocketbaseVideo: React.FC<PocketbaseVideoProps> = ({ album, fileName, className, controls = true, muted = false, posterTimeSeconds = 1 }) => {
  const url = useMemo(() => pb.files.getURL(album as unknown as RecordModel, fileName), [album, fileName]);
  const poster = useVideoPoster(url, posterTimeSeconds);

  return <video className={className} src={url} poster={poster} controls={controls} muted={muted} preload="metadata" playsInline />;
};

export default PocketbaseVideo;
