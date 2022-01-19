export default function Numerik ({ model, setModel, field, disabled = false }) {
    return (
        <input type="number" className="w-full disabled:bg-gray-200 text-[14px] h-9 px-2" 
        value={model[field]}
        disabled={disabled}
        onChange={e => setModel(prev => ({
            ...prev,
            [field]: parseInt(e.target.value)
        }))}
        />
    )
}