import { useEffect, useState } from 'react';
import fetchJson from "lib/fetchJson";
import useSWR from "swr";
import Link from 'next/link';

export default function DaftarResponden({ user }) {
    const { data, error } = useSWR(`/api/get?q=daftar`, fetchJson)
    
    const [mine, setMine] = useState([]);
    
    useEffect(() => {
        if (data) {
            setMine(data.filter(item => item._user == user._id))
        }
    }, [data, setMine, user])
    
    if (error) return <div>ERROR</div>
    if (!data) return <div>NO DATA</div>
    
    return (
        <>
            <div className="mt-16 mb-20">
                <h2 className="text-lg font-bold">My Data</h2>
                <Table data={mine} />
            </div>
            
            <div className="">
                <h2 className="text-lg font-bold">All Data</h2>
                <Table data={data} />
            </div>
        </>
    )
}

function Table ({ data }) {
    
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
                <tr key={`key-${i}`} className="border-b">
                    <td className="p-2 w-8">{i + 1}</td>
                    <td className="p-2 w-24 whitespace-nowrap">{r.tanggal}</td>
                    <td className="p-2 w-1/2">
                        <Link href={`/data/${r._id}`}>
                            <a className="text-blue-500 hover:underline">{r.nama}</a>
                        </Link>
                    </td>
                    <td className="p-2">{r.desa}</td>
                    <td className="p-2">{r.enumerator}</td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}