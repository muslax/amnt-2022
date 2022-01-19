import fetchJson from 'lib/fetchJson';
import { generatePOSTData } from 'lib/utils';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function NewName() {
    const router = useRouter()
    const [nama, setNama] = useState('')
    const [confirm, setConfirm] = useState(false)
    const [submitting, setSubmitting] = useState(false);
    
    async function newName(e) {
        e.preventDefault();
        setSubmitting(true)
        
        try {
            const rs = await fetchJson("/api/post?q=new-name", generatePOSTData({
                nama: nama,
            }))
            
            router.push(`/data/${rs.id}`)
        } catch (error) {
            alert("ERROR")
        }
        setSubmitting(false)
    }
    
    return (
        <div>
            <div className="flex items-center space-x-3 pt-8 pb-3">
                <div className="w-80">
                    <input 
                    type="text" 
                    value={nama}
                    onChange={e => {
                        setNama(e.target.value)
                        setConfirm(false)
                        document.getElementById('confirm').checked = false
                    }}
                    className='w-full text-[14px] h-9 px-2' 
                    placeholder='New Respondent'
                    />
                </div>
                <input type="checkbox" className='w-6 h-6' id="confirm" value={confirm} disabled={nama.length < 5}
                onChange={e => {
                    setConfirm(e.target.checked)
                }}
                />
                {!submitting && <button disabled={! confirm} onClick={newName}
                className="h-9 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white text-sm font-medium px-4">Create New Respondent</button>}
                {submitting && <button disabled
                className='submitting h-9 opacity-50 text--white text-sm font-medium px-8'
                >Saving...</button>}
            </div>
        </div>
    )
}