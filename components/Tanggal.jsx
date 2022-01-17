export default function Tanggal ({ model, setModel, field }) {
    return (
        <input type="date" className="w-full text-[14px] h-9 px-2" 
        value={model[field]}
        onChange={e => setModel(prev => ({
            ...prev,
            [field]: e.target.value
        }))}
        />
    )
}