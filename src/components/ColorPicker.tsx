'use client';

import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

// A curated list of attractive, theme-friendly colors for the picker
const COLOR_PALETTE = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#84cc16',
  '#22c55e',
  '#14b8a6',
  '#06b6d4',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#ec4899',
  '#78716c',
  '#f43f5e',
  '#d946ef',
  '#16a34a',
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className='w-full justify-start gap-2 font-normal'>
          <div
            className='h-5 w-5 rounded-full border'
            style={{ backgroundColor: value }}
          />
          <span>{value}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <div className='grid grid-cols-4 gap-2 p-2'>
          {COLOR_PALETTE.map((color) => (
            <button
              key={color}
              className={cn(
                'h-8 w-8 rounded-full border transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                value === color && 'ring-2 ring-ring ring-offset-2'
              )}
              style={{ backgroundColor: color }}
              onClick={() => onChange(color)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
