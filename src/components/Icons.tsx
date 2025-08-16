import {
  UtensilsCrossed,
  ShoppingBag,
  Car,
  FileText,
  ShoppingCart,
  HeartPulse,
  Ticket,
  Plane,
  GraduationCap,
  Gift,
  TrendingUp,
  MoreHorizontal,
  Coffee,
  Bike,
  Smartphone,
  Wifi,
  Zap,
  Flame,
  Droplets,
  Home,
  Repeat,
  Fuel,
  Bus,
  ParkingCircle,
  Shirt,
  Laptop,
  Lamp,
  Paintbrush,
  Stethoscope,
  Pill,
  Hospital,
  ShieldCheck,
  Dumbbell,
  Scissors,
  Sparkles,
  Film,
  Gamepad2,
  Landmark,
  FileSpreadsheet,
  Dog,
  Baby,
  Heart,
  BedDouble,
  LucideProps,
} from 'lucide-react';
import { cn } from '@/lib/utils'; // Import the 'cn' utility from shadcn

const iconMap = {
  UtensilsCrossed,
  ShoppingBag,
  Car,
  FileText,
  ShoppingCart,
  HeartPulse,
  Ticket,
  Plane,
  GraduationCap,
  Gift,
  TrendingUp,
  MoreHorizontal,
  Coffee,
  Bike,
  Smartphone,
  Wifi,
  Zap,
  Flame,
  Droplets,
  Home,
  Repeat,
  Fuel,
  Bus,
  ParkingCircle,
  Shirt,
  Laptop,
  Lamp,
  Paintbrush,
  Stethoscope,
  Pill,
  Hospital,
  ShieldCheck,
  Dumbbell,
  Scissors,
  Sparkles,
  Film,
  Gamepad2,
  Landmark,
  FileSpreadsheet,
  Dog,
  Baby,
  Heart,
  BedDouble,
};

export type IconName = keyof typeof iconMap;

// We use an intersection type to combine our custom props with the standard LucideProps
type IconProps = {
  name: IconName | string;
  categoryName?: string;
} & LucideProps; // This allows all Lucide props like `className`, `size`, etc.

export const Icon = ({
  name,
  categoryName,
  className,
  ...props
}: IconProps) => {
  const isKnownIcon = name in iconMap;

  if (isKnownIcon) {
    const LucideIcon = iconMap[name as IconName];
    // We pass the className and all other props to the actual Lucide icon
    return <LucideIcon className={className} {...props} />;
  }

  // --- FALLBACK LOGIC FIX ---
  const getInitials = (nameStr: string = '') => {
    const words = nameStr.split(' ').filter(Boolean);
    if (words.length > 1) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return nameStr.substring(0, 2).toUpperCase();
  };

  // For the div, we ONLY use the `className`. We discard the other SVG-specific props from `...props`.
  // The `cn` utility safely merges the default classes with any `className` passed in the props.
  return (
    <div
      className={cn(
        'flex items-center justify-center h-full w-full font-bold text-xs',
        className
      )}
      // We do NOT spread `{...props}` here anymore.
    >
      {getInitials(categoryName)}
    </div>
  );
};
