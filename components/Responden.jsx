import { useEffect, useState } from 'react';
import Row from "./Row";
import Select from './Select';
import Tanggal from './Tanggal';
import Textual from './Textual';
import fetchJson from 'lib/fetchJson';
import { generatePOSTData, getNextEnv } from 'lib/utils';
import useSWR, { useSWRConfig } from 'swr';
import ButtonSave from './ButtonSave';
import isEqual from 'lodash.isequal';
import ButtonSubmit from './ButtonSubmit';

export default function Responden ({ user, responden, editable }) {
    const { data, error } = useSWR(`/api/get?q=enums`, fetchJson)
    const { data: daftarDesa, error: desaError } = useSWR(`/api/get?q=desa`, fetchJson)
    
    const [model, setModel] = useState(responden);
    const [enums, setEnums] = useState([]);
    const [desa, setDesa] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    
    const { mutate } = useSWRConfig()
    
    useEffect(() => {
        if (data) {
            let array =[]
            data.forEach(d => {
                array.push(d.fullname)
            })
            
            setEnums(array)
        }
        
        if (daftarDesa) {
            let array = []
            for (var i in daftarDesa) array.push(daftarDesa[i].nama)
            setDesa(array)
        }
        
        return () => {}
    }, [data, daftarDesa, setEnums, setDesa])
    
    function isDirty() {
        return ! isEqual(model, responden)
    }
    
    async function saveResponden(e) {
        e.preventDefault();
        setSubmitting(true)
        try {
            // Umur
            if (Date.parse(model.tanggalLahir)) {
                const ldate = new Date(model.tanggalLahir).getFullYear()
                const ynow = new Date().getFullYear()
                const umur = ynow - ldate
                model.umur = umur
            }
            
            const rs = await fetchJson("/api/post?q=save-responden", generatePOSTData(model))
            mutate(`/api/get?q=responden&id=${responden._id}`)
            mutate(`/api/get?q=anggota&idr=${responden._id}`)
        } catch (error) {
            alert("ERROR")
        }
        setSubmitting(false)
    }
    
    return (
        <div className="my-10">
            <h3 className="text-blue-500 font-bold mb-3">
                Responden{` `}
                <span className='text-red-600'>{model._id}</span>
            </h3>
            <table className="w-full text-sm">
                <tbody>
                    <Row label="Tanggal wawancara:">
                        <Tanggal  model={model} setModel={setModel} field="tanggal" />
                    </Row>
                    <Row label="Enumerator:">
                        <Select 
                        target={model} setTarget={setModel} field="enumerator" defaultValue={user.fullname}
                        options={enums} 
                        />
                    </Row>
                    
                    {getNextEnv() == 'development' && (
                        <Row label="Data entri:">
                            <Select 
                            target={model} setTarget={setModel} field="entry" defaultValue={user.fullname}
                            options={enums} 
                            />
                        </Row>
                    )}
                    
                    <Row label="1. Nama lengkap:">
                        <Textual model={model} setModel={setModel} field="nama" />
                    </Row>
                    <Row label="2. Desa:">
                        <Select 
                            target={model} setTarget={setModel} field="desa" 
                            options={desa} 
                        />
                    </Row>
                    <Row label="3. Jenis kelamin:">
                        <Select 
                        target={model} setTarget={setModel} field="gender" 
                        options={['Laki-laki', 'Perempuan']} 
                        />
                    </Row>
                    <Row label="4. Tanggal lahir:">
                        <Tanggal  model={model} setModel={setModel} field="tanggalLahir" />
                    </Row>
                    <Row label="5. Status/hubungan keluarga:">
                        <Select 
                        target={model} setTarget={setModel} field="statusKeluarga" 
                        options={[
                            'Kepala keluarga (L)',
                            'Kepala keluarga (P)',
                            'Istri',
                            'Anak',
                            'Saudara',
                            'Lainnya',
                        ]} 
                        />
                    </Row>
                    <Row label="6. Status perkawinan:">
                        <Select 
                            target={model} setTarget={setModel} field="statusMarital" 
                            options={[
                                'Menikah',
                                'Cerai hidup',
                                'Cerai mati',
                                'Belum menikah',
                            ]} 
                        />
                    </Row>
                    <Row label="7. Pendidikan terakhir:">
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
                    <Row label="8a. Jumlah keluarga serumah:">
                        <Select 
                            target={model} setTarget={setModel} field="jumlahKlgSerumah" 
                            options={[
                                '1 keluarga',
                                '2 keluarga',
                                '3 keluarga atau lebih',
                            ]} 
                        />
                    </Row>
                    <Row label="8b. Jumlah orang serumah:">
                        <Select 
                            target={model} setTarget={setModel} field="jumlahOrangSerumah" 
                            options={[
                                '1 orang',
                                '2 orang',
                                '3 orang',
                                '4 orang',
                                '5 orang',
                                '6 orang',
                                '7 orang',
                                '8 orang',
                                '9 orang',
                                '10 orang atau lebih',
                            ]} 
                        />
                    </Row>
                    
                    <Row label="9. Agama:">
                        <Select 
                            target={model} setTarget={setModel} field="agama" 
                            options={[
                                'Islam',
                                'Kristen',
                                'Katolik',
                                'Hindu',
                                'Budha',
                            ]} 
                        />
                    </Row>
                    <Row label="10. Suku:">
                        <Select 
                            target={model} setTarget={setModel} field="suku" 
                            options={[
                                'Sasak',
                                'Sumbawa/Samawa',
                                'Bima',
                                'Bali',
                                'Jawa',
                                'Madura',
                                'Lainnya'
                            ]} 
                        />
                    </Row>
                    <Row label="11. Bahasa sehari-hari:">
                        <Select 
                            target={model} setTarget={setModel} field="bahasa" 
                            options={[
                                'Bahasa Indonesia',
                                'Bahasa Sasak',
                                'Bahasa Sumbawa',
                                'Bahasa Jawa',
                                'Bahasa Bali',
                                'Lainnya'
                            ]} 
                        />
                    </Row>
                    <Row label="12a. Lama tinggal:">
                        <Select 
                            target={model} setTarget={setModel} field="lamaTinggal" 
                            options={[
                                'Sejak lahir',
                                'Kurang dari 5 tahun',
                                'Lebih dari 5 tahun',
                            ]} 
                            effect={() => setModel(m => ({...m, asal: ''}))}
                        />
                    </Row>
                    <Row label="12b. Daerah asal:">
                        <Textual model={model} setModel={setModel} field="asal" disabled={model.lamaTinggal.length < 12} />
                    </Row>
                    
                    <Row label="13a. Pekerjaan utama:">
                        <Select 
                            target={model} setTarget={setModel} field="pekerjaanUtama" 
                            options={jenisPekerjaan} 
                        />
                    </Row>
                    <Row label="13b. Pekerjaan lain:">
                        <Select 
                            target={model} setTarget={setModel} field="pekerjaanLain" 
                            options={jenisPekerjaan} 
                        />
                    </Row>
                    
                    <Row label="">
                        {editable && !submitting && <ButtonSave clickHandler={saveResponden} dirty={isDirty()} />}
                        <ButtonSubmit submitting={submitting} />
                    </Row>
                </tbody>
            </table>
            
            {/* <div className="flex my-5 text-[11px] text-red-500">
                <pre className="w-1/2 pr-4 overflow-auto">{JSON.stringify(model, null, 2)}</pre>
                <pre className="w-1/2 pr-4 overflow-auto">{JSON.stringify(responden, null, 2)}</pre>
            </div> */}
        </div>
    )
}

const sumberPendapatan = [
    'Gaji',
    'Upah',
    'Penjualan',
    'Bantuan kerabat',
    'Bantuan sosial',
    'Lainnya',
]

const kelompokPendapatan = [
    'S/d Rp 500.000',
    'S/d Rp 2.000.000',
    'S/d Rp 4.000.000',
    'S/d Rp 6.000.000',
    'S/d Rp 8.000.000',
    'S/d Rp 10.000.000',
    '> Rp 10.000.000',
]

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