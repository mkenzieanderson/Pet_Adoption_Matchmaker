import X from "../../assets/x_icon.png"

type ChecklistOptions = {
    label: string;
    value: string;
}

type ChecklistProps = {
    title?: string;
    options: ChecklistOptions[];
    selectedOptions: (string | undefined)[];
    setSelectedOptions: React.Dispatch<React.SetStateAction<(string | undefined)[]>>;
}

function Checklist ({ title, options, selectedOptions, setSelectedOptions }: ChecklistProps) {

    const toggleOption = (value: string) => {
        setSelectedOptions(prev =>
            prev.includes(value) ? 
                prev.filter(checked_option => checked_option !== value)
                : [...prev, value]
        );
    };

    return (
        <div className="font-header text-espresso">
            {title && <label className="font-semibold text-lg block mb-1">{title}</label>}
            <div className="flex flex-row flex-wrap gap-8 mt-2">
                {options.map((option, _index) => {
                    return (
                        <div className="flex items-center">
                            <span>
                                <button
                                    className={`h-[35px] w-[35px] bg-white border-tawny-brown
                                                border-[3px] rounded-lg`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleOption(option.value)
                                    }}
                                >
                                    {selectedOptions.includes(option.value) && (
                                        <img src={X} alt="Selected" className="w-[32px] h-[28px]"/>
                                    )}
                                </button>
                            </span>
                            <span className="ml-2">
                                {option.label}
                            </span>
                        </div>
                    )
                })}
            </div>   
        </div>
    )
}

export default Checklist