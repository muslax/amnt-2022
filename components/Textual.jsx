export default function Textual ({ model, setModel, field, margin = '' }) {
    return (
        <input type="text" className={`w-full text-[14px] h-9 px-2 ${margin}`} 
        value={model[field]}
        onChange={e => setModel(prev => ({
            ...prev,
            [field]: e.target.value
        }))}
        />
    )
}