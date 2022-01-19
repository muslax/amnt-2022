export default function Select ({ options, target, setTarget, field, defaultValue, effect = () => {} }) {
    return (
        <select 
        className="w-full text-[14px] h-9 px-2 py-1"
        defaultValue={defaultValue ?? ''}
        value={target[field] ?? ''}
        onChange={e => {
            setTarget(prev => ({
                ...prev,
                [field]: e.target.value,
            }))
            effect()
        }}
        >
            <option value="">-</option>
            {options.map(s => (
                <option key={s} value={s}>{s}</option>
            ))}
        </select>
    )
}