import React from 'react'; // Ensure React is imported for JSX runtime
import { pb } from '../../services/api/client';
import type { Album } from '../../models/albums';
import type { RecordModel } from 'pocketbase';
import styles from './index.module.scss';

interface PocketbaseImageProps {
   album: Album;
    imageName: string;
}

const PocketbaseImage: React.FC<PocketbaseImageProps> = ({ album, imageName }) => {
    const url = pb.files.getURL(album as unknown as RecordModel, imageName);

    return <img src={url} alt="Image" className={styles.responsiveImage} />;
};

export default PocketbaseImage;