import fetchJson from 'lib/fetchJson';
import { NewAset } from 'lib/models';
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

export default function Aset({ idr, editable }) {
    const { mutate } = useSWRConfig()
    const { data, error } = useSWR(`/api/get?q=aset&id=${idr}`, fetchJson)
    const [model, setModel] = useState(NewAset('NEW'));
    
    useEffect(() => {
        if (data) {
            setModel(data)
        }
        
        return () => {}
    }, [data, setModel])
    
    async function saveAset() {
        try {
            await fetchJson("/api/post?q=save-aset", generatePOSTData({
                idr: idr,
                data: model
            }))
            mutate(`/api/get?q=aset&id=${idr}`)
        } catch (error) {
            alert("ERROR")
        }
    }
    
    return (
        <div className="my-10">
            <h3 className="text-blue-500 font-bold mb-3">Rumah dan Tanah</h3>
            <table className="w-full text-sm">
                <tbody>
                    <Row label="Jenis rumah:">
                        <Select 
                            target={model} setTarget={setModel} field="jenis" 
                            options={[
                                'Permanen',
                                'Semi permanen'
                            ]} 
                        />
                    </Row>
                    <Row label="Luas rumah (m2):">
                        <Numerik model={model} setModel={setModel} field="luas" />
                    </Row>
                    <Row label="Jumlah ruang:">
                        <Select 
                            target={model} setTarget={setModel} field="ruang" 
                            options={[
                                '1',
                                '2',
                                '3',
                                '4',
                                '5 atau lebih',
                            ]} 
                        />
                    </Row>
                    <Row label="Status rumah:">
                        <Select 
                            target={model} setTarget={setModel} field="statusRumah" 
                            options={[
                                'Milik sendiri',
                                'Menyewa',
                                'Milik orang tua',
                                'Milik kerabat/teman',
                                'Rumah dinas',
                            ]} 
                        />
                    </Row>
                    <Row label="Bukti status:">
                        <Select 
                            target={model} setTarget={setModel} field="buktiStatus" 
                            options={[
                                'Sertifikat',
                                'Akta jual beli',
                                'Izin Mendirikan Bangunan',
                                'Girik / Surat Keterangan Desa',
                                'Lainnya',
                            ]} 
                        />
                    </Row>
                    
                    <tr><td colSpan="2" >&nbsp;</td></tr>
                    
                    <Row label="Luas tanah yang dimiliki (m2):">
                        <Numerik model={model} setModel={setModel} field="luasTanah" />
                    </Row>
                    <Row label="Luas bangunan yang dimilki (m2):">
                        <Numerik model={model} setModel={setModel} field="luasBangunan" />
                    </Row>
                    <Row label="Luas lahan produktif (m2):">
                        <Numerik model={model} setModel={setModel} field="luasProduktif" />
                    </Row>
                    <Row label="Luas lahan nonproduktif (m2):">
                        <Numerik model={model} setModel={setModel} field="luasNonProduktif" />
                    </Row>
                    <Row label="Luas lahan lainnya (m2):">
                        <Numerik model={model} setModel={setModel} field="luasLainnya" />
                    </Row>
                    
                    <tr><td colSpan="2" >&nbsp;</td></tr>
                    
                    <Row label="Kepemilikan mobil:">
                        <Numerik model={model} setModel={setModel} field="mobil" />
                    </Row>
                    <Row label="Kepemilikan sepedamotor:">
                        <Numerik model={model} setModel={setModel} field="motor" />
                    </Row>
                    <Row label="Kepemilikan perahu bermotor:">
                        <Numerik model={model} setModel={setModel} field="perahuMesin" />
                    </Row>
                    <Row label="Kepemilikan perahu nonmotor:">
                        <Numerik model={model} setModel={setModel} field="perahuNonMesin" />
                    </Row>
                    <Row label="Kepemilikan traktor:">
                        <Numerik model={model} setModel={setModel} field="traktor" />
                    </Row>
                    <Row label="Sumber listrik:">
                        <Select 
                            target={model} setTarget={setModel} field="sumberListrik" 
                            options={[
                                'PLN',
                                'Genset komunal',
                                'Genset pribadi',
                                'Panel surya',
                                'Mikrohidro',
                                'Lainnya',
                            ]} 
                        />
                    </Row>
                    
                    <Row label="">
                        {editable && <ButtonSave clickHandler={saveAset} />}
                    </Row>
                </tbody>
            </table>
            
            {/* <pre className="text-xs text-red-600 my-5">{JSON.stringify(model, null, 2)}</pre> */}
        </div>
    )
}
