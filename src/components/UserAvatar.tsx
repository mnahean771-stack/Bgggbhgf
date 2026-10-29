import React from 'react';
import { useApp } from '../context/AppContext';

interface UserAvatarProps {
  className?: string;
  src?: string;
  alt?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  className = 'w-10 h-10',
  src,
  alt = 'User Avatar'
}) => {
  const { user } = useApp();

  // If specific src is given, use it; otherwise use user.avatar if set, else /main-logo.jpg
  const candidate = src !== undefined ? src : user?.avatar;
  const imageSrc =
    candidate && candidate !== '/avatar.svg' && candidate.trim() !== ''
      ? candidate
      : '/main-logo.jpg';

  return (
    <div className={`relative rounded-full overflow-hidden shrink-0 select-none bg-white border border-slate-200 shadow-2xs flex items-center justify-center p-0.5 ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src !== '/Main logo.jpg') {
            target.src = '/Main logo.jpg';
          }
        }}
        className="w-full h-full object-cover rounded-full"
      />
    </div>
  );
};
