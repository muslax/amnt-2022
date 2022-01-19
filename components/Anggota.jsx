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
import isEqual from 'lodash.isequal';
import ButtonSubmit from './ButtonSubmit';

export default function Anggota ({ idr, editable }) {
    const { data, error } = useSWR(`/api/get?q=anggota&idr=${idr}`, fetchJson)
    const { mutate } = useSWRConfig()
    
    const [model, setModel] = useState(null);
    const [proxy, setProxy] = useState(null);
    const [daftar, setDaftar] = useState([]);
    const [add, setAdd] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    useEffect(() => {
        if (data && data.length > 0) {
            setDaftar(data)
        }
        
        return () => {}
    }, [data])
    
    function isDirty() {
        return ! isEqual(model, proxy)
    }
    
    async function saveAnggota() {
        setSubmitting(true)
        try {
            await fetchJson("/api/post?q=save-anggota", generatePOSTData(model))
            mutate(`/api/get?q=anggota&idr=${idr}`)
        } catch (error) {
            alert("ERROR")
        }
        // setDaftar(prev => ([...prev, model]));
        setAdd(false)
        setModel(null)
        setSubmitting(false)
    }
    
    async function deleteAnggota(id) {
        try {
            await fetchJson(`/api/post?q=delete-anggota&id=${id}`, generatePOSTData(model))
            mutate(`/api/get?q=anggota&idr=${idr}`)
        } catch (error) {
            alert("ERROR")
        }
        // setDaftar(prev => ([...prev, model]));
        setAdd(false)
        setModel(null)
    }
    
    return (
        <div className="my-10">
            <h3 className="text-blue-500 font-bold mb-3">Anggota Keluarga</h3>
            
            <div className="overflow-auto mb-4">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-400 text-white whitespace-nowrap">
                            <td className="p-2">#</td>
                            <td className="p-2 border-l">Nama</td>
                            <td className="p-2 border-l">L/P</td>
                            <td className="p-2 border-l">Umur</td>
                            <td className="p-2 border-l">Hubungan</td>
                            <td className="p-2 border-l">Status</td>
                            <td className="p-2 border-l">MH</td>
                            <td className="p-2 border-l">Pendidikan</td>
                            <td className="p-2 border-l">Pekerjaan</td>
                            <td className="p-2 border-l">Pekerjaan lain</td>
                        </tr>
                    </thead>
                    <tbody>
                        {daftar.map((a, i) => (
                            <tr 
                            key={i + a.nama} 
                            className="border-b whitespace-nowrap first:bg-gray-200 cursor-pointer"
                            onClick={e => {
                                if (! editable) return
                                if (model && model._id == 'NEW') return
                                if (a._id != a._idr) {
                                    if (! model) {
                                        setModel(a);
                                        setProxy(a);
                                        setAdd(true)
                                    } else {
                                        setAdd(false)
                                        setModel(null)
                                        setProxy(null)
                                    }
                                }
                            }}
                            >
                                <td className="p-2">{i + 1}</td>
                                <td className="p-2 border-l border-gray-300">{a.nama}</td>
                                <td className="p-2 border-l border-gray-300">{a.gender}</td>
                                <td className="p-2 border-l border-gray-300">{a.umur}</td>
                                <td className="p-2 border-l border-gray-300">{a.hubungan}</td>
                                <td className="p-2 border-l border-gray-300">{a.marital}</td>
                                <td className="p-2 border-l border-gray-300">{a.melekHuruf}</td>
                                <td className="p-2 border-l border-gray-300">{a.pendidikan}</td>
                                <td className="p-2 border-l border-gray-300">{a.pekerjaanUtama}</td>
                                <td className="p-2 border-l border-gray-300">{a.pekerjaanLain}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {! add && editable && (
                <div className="my-4">
                    <button 
                    onClick={e => {
                        setModel(newModel(idr))
                        setProxy(newModel(idr))
                        setAdd(true)
                    }} 
                    className="h-9 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium px-4"
                    >Add Anggota Keluarga</button>
                </div>
            )}
            
            {add && (
            <table className="w-full text-sm">
                <tbody>
                    <Row label="ID:">
                        {model._id}
                    </Row>
                    <Row label="Nama lengkap:">
                        <Textual model={model} setModel={setModel} field="nama" />
                    </Row>
                    <Row label="Status/hubungan keluarga:">
                        <Select 
                        target={model} setTarget={setModel} field="hubungan" 
                        options={[
                            'Kepala keluarga',
                            'Istri',
                            'Anak',
                            'Orang tua',
                            'Saudara',
                            'Lainnya',
                        ]} 
                        />
                    </Row>
                    <Row label="Jenis kelamin:">
                        <Select 
                        target={model} setTarget={setModel} field="gender" 
                        options={['Laki-laki', 'Perempuan']} 
                        />
                    </Row>
                    <Row label="Status perkawinan:">
                        <Select 
                            target={model} setTarget={setModel} field="marital" 
                            options={[
                                'Menikah',
                                'Cerai hidup',
                                'Cerai mati',
                                'Belum menikah',
                            ]} 
                        />
                    </Row>
                    <Row label="Usia:">
                        <Numerik model={model} setModel={setModel} field="umur" />
                    </Row>
                    <Row label="Melek huruf:">
                        <Select 
                            target={model} setTarget={setModel} field="melekHuruf" 
                            options={[
                                'Ya',
                                'Tidak',
                            ]} 
                        />
                    </Row>
                    <Row label="Pendidikan:">
                        <Select 
                            target={model} setTarget={setModel} field="pendidikan" 
                            options={[
                                'Tidak lulus SD',
                                'Lulus SD',
                                'Lulus SMP',
                                'Lulus SMA',
                                'Lulus Sekolah Kejuruan',
                                'Lulus Perguruan Tinggi',
                            ]} 
                        />
                    </Row>
                    <Row label="Pekerjaan:">
                        <Select 
                            target={model} setTarget={setModel} field="pekerjaanUtama" 
                            options={jenisPekerjaan} 
                        />
                    </Row>
                    <Row label="Pekerjaan lain:">
                        <Select 
                            target={model} setTarget={setModel} field="pekerjaanLain" 
                            options={jenisPekerjaan} 
                        />
                    </Row>
                    <Row label="">
                        <div className="flex">
                            <div className="flex-grow">
                                {!submitting && <ButtonSave clickHandler={saveAnggota} dirty={isDirty()} />}
                                <ButtonSubmit submitting={submitting} />
                                <ButtonCancel clickHandler={e => {
                                    setAdd(false)
                                    setModel(null)
                                    setProxy(null)
                                }} />
                            </div>
                            {model._id != 'NEW' && (
                                <ButtonDelete clickHandler={e => deleteAnggota(model._id)} />
                            )}
                        </div>
                    </Row>
                </tbody>
            </table>
            )}
            {/* <pre className="text-[10px] text-red-500">{JSON.stringify(model, null, 2)}</pre> */}
        </div>
    )
}

function newModel(idr) {
    return {
        _id: 'NEW',
        _idr: idr, // responden._id,
        nama: '',
        hubungan: '',
        gender: '',
        marital: '',
        umur: 0,
        melekHuruf: '',
        pendidikan: '',
        pekerjaanUtama: '',
        pekerjaanLain: '',
    }
} 
const jenisPekerjaan = [
    'Tidak bekerja',
    'Petani',
    'Nelayan',
    'PNS',
    'Tentara/Polisi',
    'Buruh',
    'Wirausaha',
    'Pedagang',
    'Karyawan swasta',
    'Ibu rumah tangga',
    'Pensiunan',
    'Lainnya',
]