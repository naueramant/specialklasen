import type { FunctionComponent } from 'react';
import type { MemberImage } from '../../data/members';
import styles from './index.module.scss';

interface MemberPhotoProps {
  image: MemberImage;
  alt: string;
  // sets the frame's size and shape
  className?: string;
}

// A member photo cropped to fill its frame, centred on the member's face
const MemberPhoto: FunctionComponent<MemberPhotoProps> = ({ image, alt, className }) => {
  const focus = image.focus ?? '50% 50%';

  return (
    <div className={`${styles.frame} ${className ?? ''}`}>
      <img
        src={image.src}
        alt={alt}
        className={styles.image}
        loading="lazy"
        decoding="async"
        style={{ objectPosition: focus, transformOrigin: focus, transform: image.zoom ? `scale(${image.zoom})` : undefined }}
      />
    </div>
  );
};

export default MemberPhoto;
