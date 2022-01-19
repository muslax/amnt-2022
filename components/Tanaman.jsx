import fetchJson from 'lib/fetchJson';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import Multiple from './Multiple';
import Numerik from './Numerik';
import Row from "./Row";
import Select from './Select';
import Tanggal from './Tanggal';
import Textual from './Textual';
import { useSWRConfig } from 'swr';
import { generatePOSTData } from 'lib/utils';
import ButtonSave from './ButtonSave';
import ButtonCancel from './ButtonCancel';
import ButtonDelete from './ButtonDelete';
import { NewHutan, NewIkan, NewTanaman, NewTernak } from 'lib/models';
import isEqual from 'lodash.isequal';
import ButtonSubmit from './ButtonSubmit';

export default function Tanaman ({ idr, editable }) {
    const { data, error } = useSWR(`/api/get?q=tanaman&idr=${idr}`, fetchJson)
    const { mutate } = useSWRConfig()
    
    const [model, setModel] = useState(null);
    const [proxy, setProxy] = useState(null);
    const [daftar, setDaftar] = useState([]);
    const [add, setAdd] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    useEffect(() => {
        if (data) {
            setDaftar(data)
        }
        
        return () => {}
    }, [data, setDaftar])
    
    function isDirty() {
        return ! isEqual(model, proxy)
    }
    
    async function saveItem() {
        try {
            await fetchJson(`/api/post?q=save-tanaman`, generatePOSTData(model))
            mutate(`/api/get?q=tanaman&idr=${idr}`)
        } catch (error) {
            alert("ERROR")
        }
        setAdd(false)
        setModel(null)
        setProxy(null)
    }
    
    async function deleteItem(id) {
        try {
            await fetchJson(`/api/post?q=delete-tanaman&id=${id}`, generatePOSTData(model))
            mutate(`/api/get?q=tanaman&idr=${idr}`)
        } catch (error) {
            alert("ERROR")
        }
        setAdd(false)
        setModel(null)
        setProxy(null)
    }
    
    return (
        <div className="my-10">
            <h3 className="text-blue-500 font-bold mb-3">Tanaman Produksi</h3>
            
            <div className="overflow-auto mb-4">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-400 text-white whitespace-nowrap">
                            <td className="p-2">#</td>
                            <td className="p-2 border-l">Jenis</td>
                            <td className="p-2 border-l">Luas lahan<br/>(hektar)</td>
                            <td className="p-2 border-l">Dikonsumsi<br/>kg/tahun</td>
                            <td className="p-2 border-l">Dijual<br/>kg/tahun</td>
                            <td className="p-2 border-l">Nilai jual<br/>Rp/tahun</td>
                        </tr>
                    </thead>
                    
                    <tbody>
                    {daftar.map((item, index) => (
                        <tr 
                        key={index + item.jenis} 
                        className="border-b whitespace-nowrap cursor-pointer"
                        onClick={e => {
                            if (! editable) return
                            if (model && model._id == 'NEW') return
                            if (! model) {
                                setModel(item);
                                setProxy(item)
                                setAdd(true)
                            } else {
                                setAdd(false)
                                setModel(null)
                                setProxy(null)
                            }
                        }}
                        >
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2 border-l border-gray-300">{item.jenis}</td>
                            <td className="p-2 border-l border-gray-300">{item.luas}</td>
                            <td className="p-2 border-l border-gray-300">{item.dikonsumsi}</td>
                            <td className="p-2 border-l border-gray-300">{item.dijual}</td>
                            <td className="p-2 border-l border-gray-300">{item.nilai}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            
            {! add && editable && (
                <div className="my-4">
                    <button 
                    onClick={e => {
                        setModel(NewTanaman(idr))
                        setProxy(NewTanaman(idr))
                        setAdd(true)
                    }} 
                    className="h-9 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium px-4"
                    >Add Item</button>
                </div>
            )}
            
            {add && (
            <table className="w-full text-sm">
                <tbody>
                    <Row label="ID:">
                        {model._id}
                    </Row>
                    <Row label="Jenis:">
                        <Textual model={model} setModel={setModel} field="jenis" />
                    </Row>
                    <Row label="Luas lahan:">
                        <Textual model={model} setModel={setModel} field="luas" />
                    </Row>
                    <Row label="Jumlah dikonsumsi:">
                        <Numerik model={model} setModel={setModel} field="dikonsumsi" />
                    </Row>
                    <Row label="Jumlah dijual:">
                        <Numerik model={model} setModel={setModel} field="dijual" />
                    </Row>
                    <Row label="Nilai per tahun:">
                        <Numerik model={model} setModel={setModel} field="nilai" />
                    </Row>
                    <Row label="">
                        <div className="flex">
                            <div className="flex-grow">
                                {!submitting && <ButtonSave clickHandler={saveItem} dirty={isDirty()} />}
                                <ButtonSubmit submitting={submitting} />
                                <ButtonCancel clickHandler={e => {
                                    setAdd(false)
                                    setModel(null)
                                    setProxy(null)
                                }} />
                            </div>
                            {model._id != 'NEW' && (
                                <ButtonDelete clickHandler={e => deleteItem(model._id)} />
                            )}
                        </div>
                    </Row>
                </tbody>
            </table>
            )}
            
        </div>
    )
}