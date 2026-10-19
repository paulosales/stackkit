import React from 'react';
import * as LucideIcons from 'lucide-react';

export default function DynamicIcon({ name, size = 18, className = '', ...props }) {
  const IconComponent = LucideIcons[name] || LucideIcons.Wrench;
  return <IconComponent size={size} className={className} {...props} />;
}
