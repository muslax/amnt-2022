export default function Numerik ({ model, setModel, field }) {
    return (
        <input type="number" className="w-full text-[14px] h-9 px-2" 
        value={model[field]}
        onChange={e => setModel(prev => ({
            ...prev,
            [field]: parseInt(e.target.value)
        }))}
        />
    )
}