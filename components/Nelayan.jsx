import fetchJson from 'lib/fetchJson';
import { NewNelayan } from 'lib/models';
import { generatePOSTData } from 'lib/utils';
import isEqual from 'lodash.isequal';
import { useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import ButtonSave from './ButtonSave';
import ButtonSubmit from './ButtonSubmit';
import Multiple from './Multiple';
import Numerik from './Numerik';
import Row from "./Row";
import Select from './Select';
import Tanggal from './Tanggal';
import Textual from './Textual';

export default function Nelayan ({ idr, editable }) {
    const { mutate } = useSWRConfig()
    const { data, error } = useSWR(`/api/get?q=nelayan&id=${idr}`, fetchJson)
    const [model, setModel] = useState(NewNelayan('NEW'));
    const [lokasi, setLokasi] = useState({
        lokasi1: '',
        lokasi2: '',
        lokasi3: '',
    });
    const [submitting, setSubmitting] = useState(false);
    
    useEffect(() => {
        let array = [];
        if (lokasi.lokasi1.trim()) array.push(lokasi.lokasi1.trim())
        if (lokasi.lokasi2.trim()) array.push(lokasi.lokasi2.trim())
        if (lokasi.lokasi3.trim()) array.push(lokasi.lokasi3.trim())
        
        setModel(prev => ({
            ...prev,
            lokasi: array
        }))
        
        return () => {};
    }, [lokasi, setModel])
    
    useEffect(() => {
        if (data) {
            setModel(data)
            // Reset
            setLokasi({
                lokasi1: '',
                lokasi2: '',
                lokasi3: '',
            })
            const loks = data.lokasi
            if (loks[0]) setLokasi(p => ({...p, lokasi1: loks[0]}))
            if (loks[1]) setLokasi(p => ({...p, lokasi2: loks[1]}))
            if (loks[2]) setLokasi(p => ({...p, lokasi3: loks[2]}))
        }
        
        return () => {}
    }, [data, setModel])
    
    function isDirty() {
        return ! isEqual(model, data)
    }
    
    async function saveNelayan() {
        setSubmitting(true)
        try {
            await fetchJson("/api/post?q=save-nelayan", generatePOSTData({
                idr: idr,
                data: model
            }))
            mutate(`/api/get?q=nelayan&id=${idr}`)
        } catch (error) {
            alert("ERROR")
        }
        setSubmitting(false)
    }
    
    return (
        <div className="my-10">
            <h3 className="text-blue-500 font-bold mb-3">Khusus Nelayan</h3>
            
            <table className="w-full text-sm">
                <tbody>
                    <Row label="36.&nbsp;Kebiasaan mencari ikan sehari-hari:">
                        <Select 
                            target={model} setTarget={setModel} field="polaMencari" 
                            options={[
                                'Mencari ikan dsb bersama anggota keluarga',
                                'Mencari ikan dsb bersama beberapa keluarga lain',
                                'Hasil tangkapan hanya untuk dimakan sendiri',
                                'Hasil tangkapan untuk dimakan sendiri dan dijual',
                                'Hasil tangkapan hanya untuk dijual',
                            ]} 
                        />
                    </Row>
                    
                    <Row label="37.&nbsp;Frekuensi mencari ikan:">
                        <Select 
                            target={model} setTarget={setModel} field="frekuensi" 
                            options={[
                                '1-2 kali dalam satu minggu',
                                '3-4 kali dalam satu minggu',
                                'Lebih dari 4 kali dalam satu minggu',
                                '1-2 kali dalam sebulan',
                                'Tidak tentu',
                            ]} 
                        />
                    </Row>
                    
                    <Row label="38.&nbsp;Lokasi mencari ikan:">
                        <Textual model={lokasi} setModel={setLokasi} field="lokasi1" />
                        <Textual model={lokasi} setModel={setLokasi} field="lokasi2" margin="mt-1" />
                        <Textual model={lokasi} setModel={setLokasi} field="lokasi3" margin="mt-1" />
                    </Row>
                    
                    <Row label="39.&nbsp;Hasil tangkapan setiap pergi:">
                        <Select 
                            target={model} setTarget={setModel} field="hasil" 
                            options={[
                                'Kurang dari 10 kg',
                                '10-20 kg',
                                '20-30 kg',
                                '30-40 kg',
                                '40-50 kg',
                                '50-60 kg',
                                '60-70 kg',
                                '70-80 kg',
                                '80-90 kg',
                                '90-100 kg',
                                'Lebih 100 kg',
                            ]} 
                        />
                    </Row>
                    
                    <Row label="40.&nbsp;Perbedaan 10 tahun terakhir:">
                        <Select 
                            target={model} setTarget={setModel} field="perbedaan" 
                            options={[
                                'Semakin mudah',
                                'Semakin sulit',
                                'Tidak ada perbedaaan',
                                'Tidak tahu',
                            ]} 
                        />
                    </Row>
                    
                    <Row label="- Penjelasannya:">
                        <Textual model={model} setModel={setModel} field="infoPerbedaan" />
                    </Row>
                    
                    <Row label="41.&nbsp;Dampak tailing:">
                        <Select 
                            target={model} setTarget={setModel} field="dampakTailing" 
                            options={[
                                'Tidak ada',
                                'Kecil',
                                'Sedang',
                                'Besar',
                            ]} 
                        />
                    </Row>
                    
                    <Row label="42.&nbsp;Perbedaan dalam kualitas:">
                        <Select 
                            target={model} setTarget={setModel} field="kualitasHasil" 
                            options={[
                                'Semakin baik',
                                'Semakin jelek',
                                'Tidak Tahu',
                            ]} 
                        />
                    </Row>
                    
                    <Row label="- Penjelasannya:">
                        <Textual model={model} setModel={setModel} field="infoKualitas" />
                    </Row>
                    
                    <Row label="43.&nbsp;Jika tailing bakal mengganggu:">
                        <Select 
                            target={model} setTarget={setModel} field="jikaTailingMengganggu" 
                            options={[
                                'Tetap melanjutkan usaha mencari ikan seperti biasanya',
                                'Mencari ikan di laut yang lebih jauh',
                                'Berkebun',
                                'Beternak',
                                'Budidaya ikan',
                                'Lainnya',
                            ]} 
                        />
                    </Row>
                    
                    <Row label="44.&nbsp;Minat mengubah pencaharian:">
                        <Select 
                            target={model} setTarget={setModel} field="minatUbahPencaharian" 
                            options={[
                                'Berminat',
                                'Tidak berminat',
                                'Tidak tahu',
                            ]} 
                        />
                    </Row>
                    <Row label="- Penjelasannya:">
                        <Textual model={model} setModel={setModel} field="infoMinatUbahPencaharian" />
                    </Row>
                    
                    <Row label="45.&nbsp;Minat ikut pelatihan:">
                        <Select 
                            target={model} setTarget={setModel} field="minatPelatihan" 
                            options={[
                                'Berminat',
                                'Tidak berminat',
                                'Tidak tahu',
                            ]} 
                        />
                    </Row>
                    <Row label="- Penjelasannya:">
                        <Textual model={model} setModel={setModel} field="infoMinatPelatihan" />
                    </Row>
                    
                    <Row label="46.&nbsp;Minat menjadi nelayan laut:">
                        <Select 
                            target={model} setTarget={setModel} field="minatMenjadiNelayanLaut" 
                            options={[
                                'Berminat',
                                'Tidak berminat',
                                'Tidak tahu',
                            ]} 
                        />
                    </Row>
                    <Row label="- Penjelasannya:">
                        <Textual model={model} setModel={setModel} field="infoMinatMenjadiNelayanLaut" />
                    </Row>
                    
                    <Row label="47.&nbsp;Yang telah dilakukan AMNT:">
                        <Textual model={model} setModel={setModel} field="yangDilakukanAMNT" />
                    </Row>
                    
                    <Row label="47.&nbsp;Harapan untuk AMNT:">
                        <Textual model={model} setModel={setModel} field="harapanUntukAMNT" />
                    </Row>
                    
                    <Row label="47.&nbsp;Harapan untuk pemerintah daerah:">
                        <Textual model={model} setModel={setModel} field="harapanUntukPemerintah" />
                    </Row>
                    
                    <Row label="">
                        {editable && !submitting && <ButtonSave clickHandler={saveNelayan} dirty={isDirty()} />}
                        <ButtonSubmit submitting={submitting} />
                    </Row>
                </tbody>
            </table>
            
            {/* <pre className="text-xs text-red-600 my-5">{JSON.stringify(model, null, 2)}</pre> */}
        </div>
    )
}
