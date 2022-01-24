import { useEffect, useState } from 'react';
import fetchJson from "lib/fetchJson";
import useSWR, { mutate } from "swr";
import Link from 'next/link';
import ButtonDelete from './ButtonDelete';
import { generatePOSTData } from 'lib/utils';

export default function DaftarResponden({ user }) {
    const { data, error } = useSWR(`/api/get?q=daftar`, fetchJson)
    const { data:progress, error:progressError } = useSWR(`/api/get?q=per-enum`, fetchJson)
    
    const [mine, setMine] = useState([]);
    
    useEffect(() => {
        if (data) {
            setMine(data.filter(item => item._user == user._id))
        }
    }, [data, setMine, user])
    
    if (error) return <div>ERROR</div>
    if (!data || !progress) return <div>NO DATA</div>
    
    return (
        <>
            <div className="mt-16 mb-20 border border-gray-400 px-4 pt-2 pb-4">
                <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-1/2 sm:pr-3">
                        <h2 className="text-sm font-bold mb-2">Per Enumerator</h2>
                        {progress.perenum.map(p => (
                            <p key={p._id} className="flex items=center text-sm border-t last:border-b border-gray-300 py-1">
                                <span className="flex-grow">{p.fullname}</span>
                                <span className="fopnt-bold">{p.responden}</span>
                            </p>
                        ))}
                    </div>
                    <div className="w-full sm:w-1/2 sm:pl-3">
                        <h2 className="text-sm font-bold mb-2 mt-4 sm:mt-0">
                            Per Desa
                            <span className="text-xs text-red-500 font-normal ml-2">Desa yang kosong tidak dihitung</span>
                        </h2>
                        {progress.perdesa.map(p => (
                            <p key={p._id} className="flex items=center text-sm border-t last:border-b border-gray-300 py-1">
                                <span className="flex-grow">{p.nama}</span>
                                <span className="fopnt-bold">{p.responden}</span>
                            </p>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="mt-16 mb-20">
                <h2 className="text-lg font-bold">My Data</h2>
                <Table data={mine} can={true} />
            </div>
            
            <div className="">
                <h2 className="text-lg font-bold">All Data</h2>
                <Table data={data} />
            </div>
            
            {/* <pre className='text-[11px]'>{JSON.stringify(progress, null, 2)}</pre> */}
        </>
    )
}

function Table ({ data, can = false }) {
    const [selected, setSelected] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    
    async function deleteResponden() {
        if (!setSelected) return
        setSubmitting(true)
        try {
            await fetchJson(`/api/post?q=delete-responden&id=${selected}`, generatePOSTData({}))
            mutate(`/api/get?q=daftar`)
        } catch (error) {
            alert("ERROR")
        }
        
        setSelected(null)
        setSubmitting(false)
    }
    
    if (data.length == 0) return (
        <table className="w-full text-sm border-t-2 border-gray-600">
            <tbody>
                <tr className="">
                    <td colSpan={5} className="p-2">- Belum ada</td>
                </tr>
            </tbody>
        </table>
    )
    
    return (
        <table className="w-full text-sm border-t-2 border-gray-600">
            <tbody>
            {data.map((r,i) => (
                <tr key={`key-${i}`} className={submitting && r._id == selected ? 'submitting opacity-40 border-b' : 'border-b'}>
                    <td className="p-2 w-6">{i + 1}</td>
                    <td className="p-2 w-8">{r._id}</td>
                    <td className="p-2 w-24 whitespace-nowrap">{r.tanggal ? r.tanggal : '---'}</td>
                    <td className="p-2 w-1/3">
                        {can && (
                            <input 
                                type="checkbox" className='w-4 h-4 mr-2' 
                                checked={selected == r._id}
                                onChange={e => {
                                    if (e.target.checked) setSelected(r._id)
                                    else setSelected(null)
                                }}
                            />
                        )}
                        <Link href={`/data/${r._id}`}>
                            <a className="text-blue-500 hover:underline">{r.nama}</a>
                        </Link>
                    </td>
                    <td className="p-2">{r.desa}</td>
                    {/* {! can && <td className="p-2">{r.enumerator}</td> } */}
                    {can && (
                        <td className="p-1 text-right">
                                <button
                                disabled={selected != r._id}
                                className='text-red-500 disabled:text-gray-300'
                                onClick={deleteResponden}
                                >Delete</button>
                        </td>
                    )}
                </tr>
            ))}
            </tbody>
        </table>
    )
}