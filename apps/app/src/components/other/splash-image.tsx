import type { ImageProps, StaticImageData } from 'next/image';
import Image from 'next/image';
import { cn } from 'ui';
import Splash from './splash.svg';

interface SplashImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  className?: string;
}

export const SplashImage: React.FC<SplashImageProps> = props => {
  const { className, ...restProps } = props;

  const renderImage = (src: StaticImageData, additionalClasses: string) => (
    <Image
      {...restProps}
      alt='Splash'
      className={cn(additionalClasses, className)}
      priority
      src={src}
    />
  );

  return (
    <>
      {renderImage(Splash, '')}
    </>
  );
};
