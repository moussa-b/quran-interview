import { InputGroup, InputGroupAddon, InputGroupInput, } from '@/components/ui/input-group'
import Image from 'next/image';
import { Search } from 'lucide-react';
import LanguageDropdown from '@/components/layout/LanguageDropdown';
import ThemeToggle from '@/components/layout/ThemeToggle';

export default function Header() {
  return (
    <header className="p-4 border-b border-gray-300 flex items-center justify-between">
      <Image
        src="/logo.svg"
        alt="App Logo"
        width={0}
        height={0}
        style={{
          height: "19px",
          width: "auto",
        }}
        priority
      />
      <div className="flex items-center gap-2">
        <InputGroup className="w-64">
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
        <LanguageDropdown />
        <ThemeToggle />
      </div>
    </header>
  );
}
