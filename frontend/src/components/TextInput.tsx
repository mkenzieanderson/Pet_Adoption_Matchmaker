import React, { ChangeEvent } from 'react';

type TextInputProps = {
    type?: string;
    title: string;
    value: string;
    width: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function TextInput (props: TextInputProps) {
    return (
        <div className="font-header text-espresso text-left">
            <label className="font-semibold text-lg block mb-1">{props.title}</label>
            <input 
                type={props.type ? props.type : "text"}
                value={props.value}
                onChange={props.onChange}
                className={`bg-white border-tawny-brown border-4 
                            rounded-lg focus:border-clay focus:outline-clay
                            ${props.width} h-12 p-3`}
            />
        </div>
    );
}

export default TextInput;