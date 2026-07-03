import { useState } from 'react';

export function useBackground() {
  const [background, setBackground] = useState<string>('default');
  const [backgroundType, setBackgroundType] = useState<'image' | 'video' | 'gradient' | 'pattern' | 'default'>('default');

  const setBackgroundSetting = (type: 'image' | 'video' | 'gradient' | 'pattern' | 'default', value: string) => {
    setBackground(value);
    setBackgroundType(type);
  };

  return { background, backgroundType, setBackgroundSetting };
}
