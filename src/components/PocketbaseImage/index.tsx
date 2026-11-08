import React from 'react';
import { FaPlay } from 'react-icons/fa';
import { pb } from '../../services/api/client';
import type { Album } from '../../models/albums';
import type { RecordModel } from 'pocketbase';
import { isVideoFile } from '../../utils/format';
import styles from './index.module.scss';

interface PocketbaseImageProps {
  album: Album;
  imageName: string;
  alt: string;
  className?: string;
  // thumbnails are silent previews; full shows playback controls for videos
  variant?: 'thumbnail' | 'full';
  // a thumb size defined on the albums images field, e.g. '300x300' (photos only)
  thumb?: string;
}

/*
    Albums hold both photos and videos, so render whichever element fits the file.
*/
const PocketbaseImage: React.FC<PocketbaseImageProps> = ({ album, imageName, alt, className, variant = 'thumbnail', thumb }) => {
  const url = pb.files.getURL(album as unknown as RecordModel, imageName);
  const mediaClass = className ? className : styles.responsiveImage;

  if (isVideoFile(imageName)) {
    if (variant === 'full') {
      return <video src={url} className={mediaClass} controls autoPlay playsInline aria-label={alt} />;
    }

    return (
      <>
        {/* #t jumps past the first (often black) frame for the poster */}
        <video src={`${url}#t=0.5`} className={mediaClass} muted playsInline preload="metadata" aria-label={alt} />
        <span className={styles.playBadge} aria-hidden>
          <FaPlay />
        </span>
      </>
    );
  }

  const imageUrl = thumb ? pb.files.getURL(album as unknown as RecordModel, imageName, { thumb }) : url;

  return <img src={imageUrl} alt={alt} className={mediaClass} loading={variant === 'thumbnail' ? 'lazy' : undefined} decoding="async" />;
};

export default PocketbaseImage;
