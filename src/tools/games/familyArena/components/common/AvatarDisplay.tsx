import React from 'react';
import { isImageAvatar } from '../../utils/imageUtils';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface AvatarDisplayProps {
  avatar?: string | null;
  name?: string;
  size?: AvatarSize;
  className?: string;
  sizeClass?: string;
  textClass?: string;
}

const SIZE_MAP: Record<AvatarSize, { sizeClass: string; textClass: string }> = {
  xs: { sizeClass: 'w-5 h-5', textClass: 'text-xs' },
  sm: { sizeClass: 'w-7 h-7', textClass: 'text-sm' },
  md: { sizeClass: 'w-10 h-10', textClass: 'text-lg' },
  lg: { sizeClass: 'w-14 h-14', textClass: 'text-2xl' },
  xl: { sizeClass: 'w-20 h-20', textClass: 'text-4xl' },
  '2xl': { sizeClass: 'w-28 h-28', textClass: 'text-6xl' },
};

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  avatar = '🚀',
  name = 'Player',
  size,
  className = '',
  sizeClass: customSizeClass,
  textClass: customTextClass,
}) => {
  const isImg = isImageAvatar(avatar);
  const sizeConfig = size ? SIZE_MAP[size] : null;
  const sizeClass = customSizeClass || sizeConfig?.sizeClass || 'w-9 h-9';
  const textClass = customTextClass || sizeConfig?.textClass || 'text-base';

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden flex-shrink-0 select-none ${sizeClass} ${className}`}
      title={name}
    >
      {isImg ? (
        <img
          src={avatar!}
          alt={name}
          className="w-full h-full object-cover rounded-full pointer-events-none"
        />
      ) : (
        <span className={`leading-none flex items-center justify-center ${textClass}`}>
          {avatar || '🎮'}
        </span>
      )}
    </div>
  );
};
