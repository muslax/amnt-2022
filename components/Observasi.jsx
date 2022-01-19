import fetchJson from 'lib/fetchJson';
import { NewObservasi } from 'lib/models';
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

export default function Observasi ({ idr, editable }) {
    const { mutate } = useSWRConfig()
    const { data, error } = useSWR(`/api/get?q=observasi&id=${idr}`, fetchJson)
    const [model, setModel] = useState(NewObservasi('NEW'));
    
    const [swadaya, setSwadaya] = useState({
        swadaya1: '',
        swadaya2: '',
        swadaya3: '',
    });
    const [submitting, setSubmitting] = useState(false);
    
    useEffect(() => {
        let array = [];
        if (swadaya.swadaya1.trim()) array.push(swadaya.swadaya1.trim())
        if (swadaya.swadaya2.trim()) array.push(swadaya.swadaya2.trim())
        if (swadaya.swadaya3.trim()) array.push(swadaya.swadaya3.trim())
        
        setModel(prev => ({
            ...prev,
            kelompokSampah: array
        }))
        
        return () => {};
    }, [swadaya, setModel])
    
    useEffect(() => {
        if (data) {
            setModel(data)
            // Reset
            setSwadaya({
                swadaya1: '',
                swadaya2: '',
                swadaya3: '',
            })
            const loks = data.kelompokSampah
            if (loks[0]) setSwadaya(p => ({...p, swadaya1: loks[0]}))
            if (loks[1]) setSwadaya(p => ({...p, swadaya2: loks[1]}))
            if (loks[2]) setSwadaya(p => ({...p, swadaya3: loks[2]}))
        }
        
        return () => {}
    }, [data, setModel])
    
    function isDirty() {
        return ! isEqual(model, data)
    }
    
    async function saveObservasi() {
        setSubmitting(true)
        try {
            await fetchJson("/api/post?q=save-observasi", generatePOSTData({
                idr: idr,
                data: model
            }))
            mutate(`/api/get?q=observasi&id=${idr}`)
        } catch (error) {
            alert("ERROR")
        }
        setSubmitting(false)
    }
    
    return (
        <div className="my-10">
            <h3 className="text-blue-500 font-bold mb-3">Observasi</h3>
            
            <table className="w-full text-sm">
                <tbody>
                    <Row label="71.&nbsp;Keberadaan genangan air:">
                        <Select 
                            target={model} setTarget={setModel} field="genangan" 
                            options={[
                                'Ya',
                                'Tidak',
                            ]} 
                        />
                    </Row>
                    <Row label="72.&nbsp;Keberadaan jentik di genangan:">
                        <Select 
                            target={model} setTarget={setModel} field="jentik" 
                            options={[
                                'Ya',
                                'Tidak',
                            ]} 
                        />
                    </Row>
                    <Row label="73.&nbsp;Keberadaan tanda-tanda vektor:">
                        <Select 
                            target={model} setTarget={setModel} field="vektor" 
                            options={[
                                'Ya',
                                'Tidak',
                            ]} 
                        />
                    </Row>
                    <Row label="74.&nbsp;Kondisi kebersihan:">
                        <Select 
                            target={model} setTarget={setModel} field="kebersihan" 
                            options={[
                                'Bersih',
                                'Cukup bersih',
                                'Kurang bersih',
                            ]} 
                        />
                    </Row>
                    <Row label="75.&nbsp;Kelompok pengelola sampah:">
                        <Textual model={swadaya} setModel={setSwadaya} field="swadaya1" />
                        <Textual model={swadaya} setModel={setSwadaya} field="swadaya2" margin="mt-1" />
                        <Textual model={swadaya} setModel={setSwadaya} field="swadaya3" margin="mt-1" />
                    </Row>
                    
                    <tr><td colSpan="2" >&nbsp;</td></tr>
                    
                    <Row label="76.&nbsp;Langit-langit:">
                        <Select 
                            target={model} setTarget={setModel} field="plafon" 
                            options={[
                                'Tidak ada',
                                'Ada, kotor',
                                'Ada, bersih',
                            ]} 
                        />
                    </Row>
                    <Row label="77.&nbsp;Dinding:">
                        <Select 
                            target={model} setTarget={setModel} field="dinding" 
                            options={[
                                'Bukan tembok',
                                'Sebagian tembok',
                                'Permanen',
                            ]} 
                        />
                    </Row>
                    <Row label="78.&nbsp;Lantai:">
                        <Select 
                            target={model} setTarget={setModel} field="lantai" 
                            options={[
                                'Tanah',
                                'Papan dan sejenisnya',
                                'Plester/ubin/keramik',
                                'Rumah panggung',
                            ]} 
                        />
                    </Row>
                    <Row label="79. Jendela kamar tidur:">
                        <Select 
                            target={model} setTarget={setModel} field="jendelaKamar" 
                            options={[
                                'Ada',
                                'Tidak ada',
                            ]} 
                        />
                    </Row>
                    <Row label="80. Jendela ruang keluarga:">
                        <Select 
                            target={model} setTarget={setModel} field="jendelaKeluarga" 
                            options={[
                                'Ada',
                                'Tidak ada',
                            ]} 
                        />
                    </Row>
                    <Row label="81. Ventilasi:">
                        <Select 
                            target={model} setTarget={setModel} field="ventilasi" 
                            options={[
                                'Kurang dari 10% dari luas lantai',
                                '10% luas lantai atau lebih',
                            ]} 
                        />
                    </Row>
                    <Row label="82. Pencahayaan:">
                        <Select 
                            target={model} setTarget={setModel} field="pencahayaan" 
                            options={[
                                'Tidak terang',
                                'Kurang terang',
                                'Terang'
                            ]} 
                        />
                    </Row>
                    
                    <tr><td colSpan="2" >&nbsp;</td></tr>
                    
                    <Row label="83. Konsumsi sayur:">
                        <Select 
                            target={model} setTarget={setModel} field="konsumsiSayur" 
                            options={[
                                'Tidak perlu',
                                '1 porsi buah 1 porsi sayur',
                                '3 porsi buah 2 porsi sayur',
                                '1 porsi sayur',
                                'Tidak tahu',
                            ]} 
                        />
                    </Row>
                    <Row label="84. Olahraga:">
                        <Select 
                            target={model} setTarget={setModel} field="olahraga" 
                            options={[
                                '1-2 kali seminggu',
                                '3-4 kali seminggu',
                                '>4 kali seminggu',
                                'Tidak pernah',
                            ]} 
                        />
                    </Row>
                    <Row label="85. Kebersihan diri:">
                        <Multiple selections={[
                            'Mandi setiap hari',
                            'Gosok gigi setiap hari',
                            'Mencuci baju',
                            'Menyetrika baju',
                            'Mengganti pakaian dalam',
                            'Mengganti baju',
                            'Rutin mengganti sprei',
                        ]} model={model} setModel={setModel} field="kebersihanDiri" />
                    </Row>
                    <Row label="86. Perokok dalam keluarga:">
                        <Select 
                            target={model} setTarget={setModel} field="perokok" 
                            options={[
                                'Ada',
                                'Tidak ada',
                            ]} 
                        />
                    </Row>
                    <Row label="87. Tempat merokok:">
                        <Select 
                            target={model} setTarget={setModel} field="tempatMerokok" 
                            options={[
                                'Di luar rumah',
                                'Di dalam rumah',
                                'Di dalam kamar',
                                'Di mana saja',
                                'Tidak tahu',
                            ]} 
                        />
                    </Row>
                    <Row label="88. Konsumsi miras:">
                        <Select 
                            target={model} setTarget={setModel} field="konsumsiMiras" 
                            options={[
                                'Tidak pernah',
                                '1 kali seminggu',
                                '2 kali seminggu',
                                '3 kali seminggu',
                                'Lebi dari 3 kali seminggu',
                            ]} 
                        />
                    </Row>
                    <Row label="89. Dampak konsumsi miras:">
                        <Multiple selections={[
                            'Mabuk',
                            'Tidak masuk kerja',
                            'Perkelahian',
                            'Kekerasan dalam rumah tangga',
                            'Mengganggu kesehatan',
                            'Memicu tindak kriminal',
                            'Mengganggu ketertiban',
                            'Meningkatkan risiko kecelakaan'
                        ]} model={model} setModel={setModel} field="dampakMiras" />
                    </Row>
                    
                    <Row label="">
                        {editable && !submitting && <ButtonSave clickHandler={saveObservasi} dirty={isDirty()} />}
                        <ButtonSubmit submitting={submitting} />
                    </Row>
                </tbody>
            </table>
            {/* <pre className="text-xs text-red-600 my-5">{JSON.stringify(model, null, 2)}</pre> */}
        </div>
    )
}