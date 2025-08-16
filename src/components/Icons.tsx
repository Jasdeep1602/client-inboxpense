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
  LucideProps,
} from 'lucide-react';

// This is our Icon Map.
// The keys (e.g., "UtensilsCrossed") are the strings we store in our database.
// The values are the actual React components from the lucide-react library.
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
};

// Define the props for our new Icon component
interface IconProps extends LucideProps {
  name: keyof typeof iconMap; // 'name' must be one of the keys from our iconMap
}

/**
 * A dynamic component that renders a Lucide icon based on a string name.
 */
export const Icon = ({ name, ...props }: IconProps) => {
  // Look up the component in our map
  const LucideIcon = iconMap[name];

  // If the icon name is not found, we can render a default or nothing
  if (!LucideIcon) {
    return <MoreHorizontal {...props} />; // Fallback to a default icon
  }

  // Render the found icon component, passing along any other props like className, size, etc.
  return <LucideIcon {...props} />;
};
