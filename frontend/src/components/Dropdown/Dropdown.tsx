import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

type DropdownOptions = {
    label: string;
    value: string | number;
}

type DropdownProps = {
    title?: string;
    width: string;
    options: DropdownOptions[];
}

function Dropdown ({ title, width, options }: DropdownProps) {
    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<DropdownOptions | null>(null);

    return (
        <div className="font-header text-espresso text-left">
            {title && <label className="font-semibold text-lg block mb-1">{title}</label>}
            <button 
                className={`bg-white border-tawny-brown border-4 min-w-[175px]
                            rounded-lg focus:border-clay focus:outline-clay
                            ${width} h-12 p-3 flex justify-between items-center`}
                onClick={(e) => {
                    e.preventDefault();
                    setOpen(!open)
                }}
            >
                { selectedOption ?
                    <span>{selectedOption.label}</span> : 
                    <span className="font-light">Select {title}</span>
                }
                <span>{open ? <FaChevronUp/> : <FaChevronDown/>}</span>
            </button>
            {open && (<div>
                {options.map((option, index) => {
                    const isFirst = index === 0;
                    const isLast = index === options.length-1;
                    return (
                        <button
                            className={`bg-white border-tawny-brown border-r-4 border-l-4
                                        ${isFirst ? 'border-t-4 rounded-tl-lg rounded-tr-lg' : 'border-t-2'}
                                        ${isLast ? 'border-b-4 rounded-bl-lg rounded-br-lg': 'border-b-2'} 
                                        focus:border-clay focus:outline-clay ${width} h-12 p-3
                                        text-left hover:bg-transparent-clay hover:border-espresso
                                        flex items-center`}
                            onClick={() => {
                                setSelectedOption(option)
                                setOpen(false)
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