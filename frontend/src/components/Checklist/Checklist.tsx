
type ChecklistOptions = {
    label: string;
    value: string | number;
}

type ChecklistProps = {
    title?: string;
    options: ChecklistOptions[];
}

function Checklist ({ title, options }: ChecklistProps) {

    return (
        <div>
            <div>{title}</div>
            <div>{options[0].label}</div>
        </div>
    )
}

export default Checklist