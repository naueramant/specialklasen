import React from 'react'; // Ensure React is imported for JSX runtime
import { pb } from '../../services/api/client';
import type { Album } from '../../models/albums';
import type { RecordModel } from 'pocketbase';
import styles from './index.module.scss';

interface PocketbaseImageProps {
  album: Album;
  imageName: string;
  className?: string;
}

const PocketbaseImage: React.FC<PocketbaseImageProps> = ({ album, imageName, className }) => {
  const url = pb.files.getURL(album as unknown as RecordModel, imageName);

  const imgClass = className ? className : styles.responsiveImage;

  return <img src={url} alt="Image" className={imgClass} />;
};

export default PocketbaseImage;
