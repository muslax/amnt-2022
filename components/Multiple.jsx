export default function Multiple ({ selections, model, setModel, field }) {
    return (
        <>
        {selections.map(s => (
            <div key={s} className="flex text-[13px]">
                <label className="flex items-center">
                    <input 
                    type="checkbox" 
                    value={s}
                    checked={model[field].includes(s)}
                    onChange={e => {
                        if (e.target.checked) {
                            if (! model[field].includes(s)) {
                                setModel(prev => ({
                                    ...prev,
                                    [field]: [...prev[field], s]
                                }))
                            }
                        } else {
                            const newValue = model[field].filter(item => item != s)
                            setModel(prev => ({
                                ...prev,
                                [field]: newValue
                            }))
                        }
                    }}
                    />
                    <span className="ml-2">{s}</span>
                </label>
            </div>
        ))}
        </>
    )
    
    /* return (
        <>
        {selections.map(s => (
            <div className="flex">
                <label className="flex items-center">
                    <input 
                    type="checkbox" 
                    value={s}
                    checked={target.includes(s)}
                    onChange={e => {
                        if (e.target.checked) {
                            if (! target.includes(s)) {
                                setTarget([...target, s])
                            }
                        } else {
                            setTarget(target.filter(item => item != s))
                        }
                    }}
                    />
                    <span className="ml-2">{s}</span>
                </label>
            </div>
        ))}
        </>
    ) */
}