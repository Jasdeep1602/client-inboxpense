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
  LayoutGrid,
  BarChart2,
  Settings,
  LucideProps,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  LayoutGrid,
  BarChart2,
  Settings,
};

export type IconName = keyof typeof iconMap;

type IconProps = {
  name: IconName | string;
  categoryName?: string;
} & LucideProps;

export const Icon = ({
  name,
  categoryName,
  className,
  // --- THIS IS THE FIX: Destructure the style prop ---
  style,
  ...props
}: IconProps) => {
  const isKnownIcon = name in iconMap;

  if (isKnownIcon) {
    const LucideIcon = iconMap[name as IconName];
    // Pass the style prop to the Lucide icon
    return <LucideIcon className={className} style={style} {...props} />;
  }

  const getInitials = (nameStr: string = '') => {
    const words = nameStr.split(' ').filter(Boolean);
    if (words.length > 1) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return nameStr.substring(0, 2).toUpperCase();
  };

  // --- THIS IS THE FIX: Pass the style prop to the fallback div ---
  return (
    <div
      className={cn(
        'flex items-center justify-center h-full w-full font-bold text-xs',
        className
      )}
      style={style} // This will apply the color to the initials
    >
      {getInitials(categoryName)}
    </div>
  );
};
