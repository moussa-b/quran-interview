import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function LanguageDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-2 rounded-md hover:bg-gray-100">
        <Globe className="w-5 h-5 text-gray-700"/>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuLabel>Français</DropdownMenuLabel>
        <DropdownMenuLabel>English</DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
