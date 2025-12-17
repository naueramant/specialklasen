import React from 'react';
import styles from './AlbumItem.module.scss';
import PocketbaseImage from '../../../components/PocketbaseImage';
import Card from '../../../components/Card';
import type { Album } from '../../../models/albums';
import { ImpactText } from '../../../components/Text';


export interface AlbumItemProps {
   album: Album;

}

export const AlbumItem: React.FC<AlbumItemProps> = ({ album }) => {
    const renderedImages = album.images.length > 4 ? album.images.slice(0, 4) : album.images;
    return (
        <>
            <ImpactText>{album.title}</ImpactText>
            <h2>{new Date(album.date).toLocaleDateString()}</h2>
            
            <Card>
                <div className={styles.albumCard}>
                    {renderedImages.map((image, imgIndex) => (
                        <PocketbaseImage key={imgIndex} album={album} imageName={image} />
                    ))}

                    <div className={styles.seeMore}>See more</div>
                </div>
            </Card>
            </>
    );
};