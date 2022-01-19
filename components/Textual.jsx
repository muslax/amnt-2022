export default function Textual ({ model, setModel, field, disabled = false, margin = '' }) {
    return (
        <input type="text" className={`w-full disabled:bg-gray-200 text-[14px] h-9 px-2 ${margin}`} 
        value={model[field]}
        disabled={disabled}
        onChange={e => setModel(prev => ({
            ...prev,
            [field]: e.target.value
        }))}
        />
    )
}