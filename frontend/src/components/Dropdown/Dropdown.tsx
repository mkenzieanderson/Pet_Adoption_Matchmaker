import { useState, useEffect, useRef } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

type DropdownOptions = {
    label: string;
    value: string | number;
}

type DropdownProps = {
    title?: string;
    width: string;
    options: DropdownOptions[];
    onChange: (option: DropdownOptions) => void;
    value?: string | number;
}

function Dropdown ({ title, width, options, onChange }: DropdownProps) {
    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<DropdownOptions | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Any click outside the dropdown menu will close the dropdown menu
    useEffect (() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={dropdownRef} className="relative font-header text-espresso text-left">
            {title && <label className="font-semibold text-lg block mb-1">{title}</label>}
            <button 
                className={`bg-white border-tawny-brown border-4
                            rounded-lg focus:border-clay focus:outline-clay
                            ${width} h-12 p-3 flex justify-between items-center`}
                onClick={(e) => {
                    e.preventDefault();
                    setOpen(!open)
                }}
            >
                { selectedOption ?
                    <span className="pr-4">{selectedOption.label}</span> : 
                    <span className="font-light pr-4">Select {title}</span>
                }
                <span>{open ? <FaChevronUp/> : <FaChevronDown/>}</span>
            </button>
            {open && (<div className="absolute z-50 max-h-60 overflow-y-auto">
                {options.map((option, index) => {
                    const isFirst = index === 0;
                    const isLast = index === options.length-1;
                    return (
                        <button
                            className={`bg-white border-tawny-brown border-r-4 border-l-4
                                        ${isFirst ? 'border-t-4 rounded-tl-lg rounded-tr-lg' : 'border-t-2'}
                                        ${isLast ? 'border-b-4 rounded-bl-lg rounded-br-lg': 'border-b-2'} 
                                        focus:border-clay focus:outline-clay ${width} h-12 p-3
                                        text-left hover:bg-clay hover:border-espresso
                                        flex items-center pr-8`}
                            onClick={() => {
                                setSelectedOption(option);
                                onChange(option);
                                setOpen(false);
                            }}
                        >
                            {option.label}
                        </button>
                    )
                })}
            </div>)}
        </div>
    );
}

export default Dropdown