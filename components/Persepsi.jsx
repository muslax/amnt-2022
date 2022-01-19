import fetchJson from 'lib/fetchJson';
import { NewPersepsi } from 'lib/models';
import { generatePOSTData } from 'lib/utils';
import { useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import ButtonSave from './ButtonSave';
import Multiple from './Multiple';
import Numerik from './Numerik';
import Row from "./Row";
import Select from './Select';
import Tanggal from './Tanggal';
import Textual from './Textual';
import isEqual from 'lodash.isequal';
import ButtonSubmit from './ButtonSubmit';

export default function Persepsi ({ idr, editable }) {
    const { mutate } = useSWRConfig()
    const { data, error } = useSWR(`/api/get?q=persepsi&id=${idr}`, fetchJson)
    const [model, setModel] = useState(NewPersepsi('NEW'));
    const [submitting, setSubmitting] = useState(false);
    
    useEffect(() => {
        if (data) {
            setModel(data)
        }
        
        return () => {}
    }, [data, setModel])
    
    function isDirty() {
        return ! isEqual(model, data)
    }
    
    async function savePersepsi() {
        setSubmitting(true)
        try {
            await fetchJson("/api/post?q=save-persepsi", generatePOSTData({
                idr: idr,
                data: model
            }))
            mutate(`/api/get?q=persepsi&id=${idr}`)
        } catch (error) {
            alert("ERROR")
        }
        setSubmitting(false)
    }
    
    return (
        <div className="my-10">
            <h3 className="text-blue-500 font-bold mb-3">Persepsi</h3>
            
            <table className="w-full text-sm">
                <tbody>
                    <Row label="90. Tahu tentang rencana AMNT:">
                        <Select 
                            target={model} setTarget={setModel} field="tahuRencana" 
                            options={[
                                'Sudah tahu',
                                'Tidak tahu',
                            ]} 
                        />
                    </Row>
                    <Row label="- Sumber infomasi:">
                        <Textual model={model} setModel={setModel} field="sumberTahu" />
                    </Row>
                    
                    <Row label="91. Manfaat umum:">
                        <Multiple selections={[
                            'Tidak ada manfaat',
                            'Mendapat layanan kesehatan',
                            'Mendapat pendidikan gratis',
                            'Mendapat beasiswa',
                            'Pembangunan infrastruktur',
                            'Mendapat pelatihan kerja',
                            'Mendapat pekerjaan',
                            'Mendapat kontrak usaha',
                            'Manfaat lainnya',
                        ]} model={model} setModel={setModel} field="manfaatEkonomi" />
                    </Row>
                    
                    <Row label="92. Pekerjaan kasar masih diminati?">
                        <Select 
                            target={model} setTarget={setModel} field="pekerjaanKasar" 
                            options={[
                                'Diminati',
                                'Tidak diminati',
                                'Tidak tahu',
                            ]} 
                        />
                    </Row>
                    <Row label="- Penjelasannya:">
                        <Textual model={model} setModel={setModel} field="infoPekerjaanKasar" />
                    </Row>
                    
                    <Row label="93. Pilihan pekerjaan:">
                        <Select 
                            target={model} setTarget={setModel} field="pilihanPekerjaan" 
                            options={[
                                'PNS',
                                'Polisi',
                                'Tentara',
                                'PT AMNT',
                                'Karyawan swasta',
                                'Wiraswasta',
                                'Lainnya',
                            ]} 
                        />
                    </Row>
                    <Row label="- Penjelasannya:">
                        <Textual model={model} setModel={setModel} field="infoPilihanPekerjaan" />
                    </Row>
                    
                    <Row label="94. Dampak AMNT terhadap lingkungan:">
                        <Select 
                            target={model} setTarget={setModel} field="dampakLingkungan" 
                            options={[
                                'Tidak ada',
                                'Ada tapi tidak terlalu mengganggu',
                                'Cukup mengganggu kehidupan sehari-hari',
                                'Sangat mengganggu kehidupan sehari-hari',
                            ]} 
                        />
                    </Row>
                    <Row label="- Penjelasannya:">
                        <Textual model={model} setModel={setModel} field="infoDampakLingkungan" />
                    </Row>
                    
                    <Row label="95. Dampak AMNT terhadap kesehatan:">
                        <Select 
                            target={model} setTarget={setModel} field="dampakKesehatan" 
                            options={[
                                'Tidak ada',
                                'Berdampak negatif',
                                'Berdampak positif',
                            ]} 
                        />
                    </Row>
                    <Row label="- Penjelasannya:">
                        <Textual model={model} setModel={setModel} field="infoDampakKesehatan" />
                    </Row>
                    
                    <Row label="96. Dampak AMNT terhadap layanan publik:">
                        <Select 
                            target={model} setTarget={setModel} field="dampakLayananPublik" 
                            options={[
                                'Tidak ada',
                                'Positif - tidak terlalu nyata',
                                'Positif - cukup nyata',
                                'Positif - sangat nyata',
                            ]} 
                        />
                    </Row>
                    <Row label="- Penjelasannya:">
                        <Textual model={model} setModel={setModel} field="infoDampakLayananPublik" />
                    </Row>
                    
                    <Row label="97. Dampak AMNT terhadap adat:">
                        <Select 
                            target={model} setTarget={setModel} field="dampakAdat" 
                            options={[
                                'Tidak ada',
                                'Ada - tidak terlalu nyata',
                                'Ada - cukup nyata',
                                'Ada - sangat nyata',
                            ]} 
                        />
                    </Row>
                    <Row label="- Penjelasannya:">
                        <Textual model={model} setModel={setModel} field="infoDampakAdat" />
                    </Row>
                    
                    
                    <Row label="9x. Dampak paling signifikan:">
                        <Select 
                            target={model} setTarget={setModel} field="dampakSignifikan" 
                            options={[
                                'Ekonomi',
                                'Lingkungan',
                                'Sosial budaya',
                                'Kesehatan masyarakat',
                                'Lainnya',
                            ]} 
                        />
                    </Row>
                    
                    <Row label="98. Kerjasama / gotongroyong di masyarakat:">
                        <Select 
                            target={model} setTarget={setModel} field="gotongroyong" 
                            options={[
                                'Masih sering',
                                'Sudah jarang',
                                'Sudah tidak ada',
                            ]} 
                        />
                    </Row>
                    <Row label="- Penjelasannya:">
                        <Textual model={model} setModel={setModel} field="infoGotongroyong" />
                    </Row>
                    
                    <Row label="99. Sikap terhadap rencana AMNT:">
                        <Select 
                            target={model} setTarget={setModel} field="dukungan" 
                            options={[
                                'Mendukung',
                                'Tidak mendukung',
                                'Terserah pemerintah',
                            ]} 
                        />
                    </Row>
                    <Row label="- Penjelasannya:">
                        <Textual model={model} setModel={setModel} field="infoDukungan" />
                    </Row>
                    
                    <Row label="100. Aktivitas sehari-hari:">
                        <Select 
                            target={model} setTarget={setModel} field="aktivitas" 
                            options={[
                                'Terbantu',
                                'Terganggu',
                                'Biasa saja',
                                'Tidak tahu',
                            ]} 
                        />
                    </Row>
                    <Row label="- Penjelasannya:">
                        <Textual model={model} setModel={setModel} field="infoAktivitas" />
                    </Row>
                    
                    <Row label="">
                        {editable && !submitting && <ButtonSave clickHandler={savePersepsi} dirty={isDirty()} />}
                        <ButtonSubmit submitting={submitting} />
                    </Row>
                </tbody>
            </table>
            
            {/* <pre className="text-xs text-red-600 my-5">{JSON.stringify(model, null, 2)}</pre> */}
        </div>
    )
}