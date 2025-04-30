import { useState, useEffect, useRef } from 'react';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function UserMenu({ userName }: { userName: string }) {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => setIsOpen(!isOpen);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsOpen(false);
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

    return (
        <div ref={menuRef} className="relative hover:cursor-pointer">
            <div onClick={toggleMenu} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-papyrus-100 hover:cursor-pointer transition-colors">
                <User size={20} className="text-papyrus-600 hover:cursor-pointer" />
                <span className="hover:cursor-pointer">{userName}</span>
            </div>

            {isOpen && (
            <div className="absolute top-full mt-2 right-0 bg-white shadow-lg border border-gray-200 rounded-lg py-2 w-40 z-50 hover:cursor-pointer">
                <button className="w-full text-left px-4 py-2 hover:bg-papyrus-100 text-sm"
                onClick={() => {navigate('/cookbooks'); setIsOpen(false);}}>
                Cookbooks
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-papyrus-100 text-sm">
                Profile
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-papyrus-100 text-sm text-red-500">
                Log out
                </button>
            </div>
            )}
        </div>
        );
}

export default UserMenu;