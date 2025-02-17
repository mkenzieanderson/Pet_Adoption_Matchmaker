import React, { ChangeEvent } from 'react';

type DropdownProps = {
    title?: string;
    width: string;
}

function Dropdown ({ title, width }: DropdownProps) {
    return (
        <div className="font-header text-espresso text-left">
            {title && <label className="font-semibold text-lg block mb-1">{title}</label>}
        </div>
    );
}

export default Dropdown