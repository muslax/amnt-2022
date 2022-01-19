import fetchJson from 'lib/fetchJson';
import { NewKesmas } from 'lib/models';
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

export default function Kesmas ({ idr, editable }) {
    const { mutate } = useSWRConfig()
    const { data, error } = useSWR(`/api/get?q=kesmas&id=${idr}`, fetchJson)
    const [model, setModel] = useState(NewKesmas('NEW'));
    const [penyakit, setPenyakit] = useState({
        penyakit1: '',
        penyakit2: '',
        penyakit3: '',
    });
    const [wabah, setWabah] = useState({
        wabah1: '',
        wabah2: '',
        wabah3: '',
    });
    const [submitting, setSubmitting] = useState(false);
    
    useEffect(() => {
        let array = [];
        if (penyakit.penyakit1.trim()) array.push(penyakit.penyakit1.trim())
        if (penyakit.penyakit2.trim()) array.push(penyakit.penyakit2.trim())
        if (penyakit.penyakit3.trim()) array.push(penyakit.penyakit3.trim())
        
        setModel(prev => ({
            ...prev,
            penyakit: array
        }))
        
        return () => {};
    }, [penyakit, setModel])
    
    useEffect(() => {
        let array = [];
        if (wabah.wabah1.trim()) array.push(wabah.wabah1.trim())
        if (wabah.wabah2.trim()) array.push(wabah.wabah2.trim())
        if (wabah.wabah3.trim()) array.push(wabah.wabah3.trim())
        
        setModel(prev => ({
            ...prev,
            wabah: array
        }))
        
        return () => {};
    }, [wabah, setModel])
    
    useEffect(() => {
        if (data) {
            setModel(data)
            // Reset
            setPenyakit({
                penyakit1: '',
                penyakit2: '',
                penyakit3: '',
            })
            setWabah({
                wabah1: '',
                wabah2: '',
                wabah3: '',
            })
            const loks = data.penyakit
            if (loks[0]) setPenyakit(p => ({...p, penyakit1: loks[0]}))
            if (loks[1]) setPenyakit(p => ({...p, penyakit2: loks[1]}))
            if (loks[2]) setPenyakit(p => ({...p, penyakit3: loks[2]}))
            
            const wab = data.wabah
            if (wab[0]) setWabah(p => ({...p, wabah1: wab[0]}))
            if (wab[1]) setWabah(p => ({...p, wabah2: wab[1]}))
            if (wab[2]) setWabah(p => ({...p, wabah3: wab[2]}))
        }
        
        return () => {}
    }, [data, setModel])
    
    function isDirty() {
        return ! isEqual(model, data)
    }
    
    async function saveKesmas() {
        setSubmitting(true)
        try {
            await fetchJson("/api/post?q=save-kesmas", generatePOSTData({
                idr: idr,
                data: model
            }))
            mutate(`/api/get?q=kesmas&id=${idr}`)
        } catch (error) {
            alert("ERROR")
        }
        setSubmitting(false)
    }
    
    return (
        <div className="my-10">
            <h3 className="text-blue-500 font-bold mb-3">Kesehatan Masyarakat</h3>
            
            <table className="w-full text-sm">
                <tbody>
                    <Row label="54.&nbsp;Penyakit setahun terakhir:">
                        <Textual model={penyakit} setModel={setPenyakit} field="penyakit1" />
                        <Textual model={penyakit} setModel={setPenyakit} field="penyakit2" margin="mt-1" />
                        <Textual model={penyakit} setModel={setPenyakit} field="penyakit3" margin="mt-1" />
                    </Row>
                    
                    <Row label="55.&nbsp;Keberadaan penderita stunting:">
                        <Select 
                            target={model} setTarget={setModel} field="stunting" 
                            options={[
                                'Ada',
                                'Tidak ada',
                            ]} 
                        />
                    </Row>
                    <Row label="- Penjelasan atau sebabnya:">
                        <Textual model={model} setModel={setModel} field="infoStunting" />
                    </Row>
                    
                    <Row label="56.&nbsp;Wabah penyakit 5 tahun terakhir:">
                        <Textual model={wabah} setModel={setWabah} field="wabah1" />
                        <Textual model={wabah} setModel={setWabah} field="wabah2" margin="mt-1" />
                        <Textual model={wabah} setModel={setWabah} field="wabah3" margin="mt-1" />
                    </Row>
                    
                    <Row label="57.&nbsp;Kebiasaan berobat:">
                        <Select 
                            target={model} setTarget={setModel} field="tempatBerobat" 
                            options={[
                                'Puskesmas',
                                'Rumah sakit pemerintah',
                                'Rumah sakit swasta',
                                'Klinik',
                                'Bidan / perawat',
                                'Orang pintar',
                            ]} 
                        />
                    </Row>
                    
                    <Row label="58.&nbsp;Akses fasilitas kesehatan:">
                        <Select 
                            target={model} setTarget={setModel} field="aksesFaskes" 
                            options={[
                                'Mudah',
                                'Sedang',
                                'Sulit',
                                'Tidak terjangkau',
                            ]} 
                        />
                    </Row>
                    
                    <Row label="59.&nbsp;Biaya layanan kesehatan:">
                        <Select 
                            target={model} setTarget={setModel} field="biaya" 
                            options={[
                                'Gratis',
                                'Terjangkau',
                                'Mahal',
                                'Tidak terjangkau',
                            ]} 
                        />
                    </Row>
                    
                    <Row label="60.&nbsp;Kartu kesehatan yang dimilki:">
                        <Multiple selections={['KIS', 'BPJS']} model={model} setModel={setModel} field="kisbpjs" />
                    </Row>
                    
                    <Row label="61.&nbsp;Kualitas layanan kesehatan:">
                        <Select 
                            target={model} setTarget={setModel} field="kualitasLayanan" 
                            options={[
                                'Sangat memadai',
                                'Cukup memadai',
                                'Kurang memadai',
                                'Tidak memadai',
                            ]} 
                        />
                    </Row>
                    
                    <tr><td colSpan="2" >&nbsp;</td></tr>
                    
                    <Row label="62.&nbsp;Sumber utama air minum dan masak:">
                        <Select 
                            target={model} setTarget={setModel} field="sumberAirMinum" 
                            options={[
                                'Air galon',
                                'Jaringan perpipaan',
                                'Sumur sendiri',
                                'Sumur tetangga',
                                'Sumur bersama',
                                'Mata air',
                                'Air hujan',
                                'Air sungai/danau',
                                'Lainnya',
                            ]} 
                        />
                    </Row>
                    
                    <Row label="63.&nbsp;Merebus air minum bukan galon:">
                        <Select 
                            target={model} setTarget={setModel} field="merebusAirMinum" 
                            options={[
                                'Ya',
                                'Tidak',
                            ]} 
                        />
                    </Row>
                    
                    <Row label="64.&nbsp;Minum berapa gelas dalam sehari:">
                        <Numerik model={model} setModel={setModel} field="konsumsiPerHari" />
                    </Row>
                    
                    <Row label="65.&nbsp;Sumber utaman air bersih:">
                        <Select 
                            target={model} setTarget={setModel} field="sumberAirBersih" 
                            options={[
                                'Jaringan perpipaan',
                                'Sumur sendiri',
                                'Sumur tetangga',
                                'Sumur bersama',
                                'Mata air',
                                'Air hujan',
                                'Air sungai/danau',
                                'Lainnya',
                            ]} 
                        />
                    </Row>
                    
                    <Row label="66.&nbsp;Masalah pemenuhan air:">
                        <Select 
                            target={model} setTarget={setModel} field="masalahAir" 
                            options={[
                                'Sumber terbatas',
                                'Air tidak bersih',
                                'Sumber terlalu jauh',
                                'Pompa sering rusak',
                                'Kran sering dibiarkan terbuka',
                                'Kran sering hilang',
                                'Lainnya',
                            ]} 
                        />
                    </Row>
                    
                    <Row label="67.&nbsp;Bila terjadi masalah air:">
                        <Select 
                            target={model} setTarget={setModel} field="penyelesaianMasalahAir" 
                            options={[
                                'Dibiarkan',
                                'Diperbaiki bersama',
                                'Diperbaiki sendiri',
                                'Diperbaiki petugas desa',
                                'Lainnya',
                            ]} 
                        />
                    </Row>
                    
                    <Row label="68. Sarana BAB keluarga:">
                        <Select 
                            target={model} setTarget={setModel} field="saranaBAB" 
                            options={[
                                'WC sendiri',
                                'WC umum',
                                'WC di sungai/kolam',
                                'Di kebun/ladang',
                                'Di pantai/laut',
                                'Lainnya',
                            ]} 
                        />
                    </Row>
                    
                    <Row label="69. Pembuangan limbah cair:">
                        <Select 
                            target={model} setTarget={setModel} field="saranaLimbahCair" 
                            options={[
                                'Saluran pembuangan',
                                'Dialirkan ke drainase',
                                'Dialirkan ke kebun',
                                'Dibiarkan menggenang',
                                'Lainnya',
                            ]} 
                        />
                    </Row>
                    
                    <Row label="70. Pengelolaan sampah:">
                        <Select 
                            target={model} setTarget={setModel} field="pengolahanSampah" 
                            options={[
                                'Dibakar',
                                'Dibuang sembarangan',
                                'Dikubur',
                                'Diambil petugas',
                                'Lainnya',
                            ]} 
                        />
                    </Row>
                    
                    <Row label="">
                        {editable && !submitting && <ButtonSave clickHandler={saveKesmas} dirty={isDirty()} />}
                        <ButtonSubmit submitting={submitting} />
                    </Row>
                </tbody>
            </table>
            
            {/* <pre className="text-xs text-red-600 my-5">{JSON.stringify(model, null, 2)}</pre> */}
        </div>
    )
}