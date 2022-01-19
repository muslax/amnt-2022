import { useEffect, useState } from 'react';
import Multiple from './Multiple';
import Numerik from './Numerik';
import Row from "./Row";
import Select from './Select';
import Tanggal from './Tanggal';
import Textual from './Textual';
import { ModelResponden, NewEkonomi } from 'lib/models';
import fetchJson from 'lib/fetchJson';
import { generatePOSTData } from 'lib/utils';
import ButtonSave from './ButtonSave';
import isEqual from 'lodash.isequal';
import useSWR, { useSWRConfig } from 'swr';
import ButtonSubmit from './ButtonSubmit';

export default function Ekonomi ({ idr, editable }) {
    const { mutate } = useSWRConfig()
    const { data, error } = useSWR(`/api/get?q=ekonomi&id=${idr}`, fetchJson)
    const [model, setModel] = useState(NewEkonomi('NEW'));
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
    
    async function saveEkonomi(e) {
        setSubmitting(true)
        try {
            await fetchJson("/api/post?q=save-ekonomi", generatePOSTData({
                idr: idr,
                data: model
            }))
            mutate(`/api/get?q=ekonomi&id=${idr}`)
        } catch (error) {
            alert("ERROR")
        }
        
        setSubmitting(false)
    }
    
    return (
        <div className="my-10">
            <h3 className="text-blue-500 font-bold mb-3">Ekonomi</h3>
            <table className="w-full text-sm">
                <tbody>
                    {/* <Row label="13a. Pekerjaan utama:">
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
                    </Row> */}
                    
                    {/* <tr><td colSpan="2" >&nbsp;</td></tr> */}
                    
                    <Row label="14. Minat kerja di AMNT:">
                        <Select 
                            target={model} setTarget={setModel} field="minatKerjaDiAMNT" 
                            options={[
                                'Berminat',
                                'Tidak berminat',
                                'Tidak tahu',
                            ]} 
                        />
                    </Row>
                    <Row label="15. Pernah melamar kerja di AMNT:">
                        <Select 
                            target={model} setTarget={setModel} field="pernahMelamarAMNT" 
                            options={[
                                'Pernah dan diterima',
                                'Pernah dan tidak diterima',
                                'Belum pernah',
                            ]} 
                        />
                    </Row>
                    <Row label="16. Kesediaan ikut pelatihan kerja:">
                        <Select 
                            target={model} setTarget={setModel} field="minatPelatihan" 
                            options={[
                                'Bersedia',
                                'Tidak bersedia',
                                'Tidak tahu',
                            ]} 
                            effect={() => setModel(m => ({...m, jenisPelatihan: ''}))}
                        />
                    </Row>
                    <Row label="16a. Jenis pelatihan yang diminati:">
                        <Textual model={model} setModel={setModel} field="jenisPelatihan" disabled={model.minatPelatihan != 'Bersedia'} />
                    </Row>
                    
                    <tr><td colSpan="2" >&nbsp;</td></tr>
                    
                    <Row label="17. Rata-rata pendapatan per bulan:">
                        <Select options={kelompokPendapatan} target={model} setTarget={setModel} field="pendapatanPerBulan" />
                    </Row>
                    <Row label="18. Sumber-sumber pendapatan:">
                        <Multiple selections={sumberPendapatan} model={model} setModel={setModel} field="sumberPendapatan" />
                    </Row>
                    
                    <tr><td colSpan="2" >&nbsp;</td></tr>
                    
                    <Row label="19. Rata-rata pengeluaran per bulan:">
                        <Select options={kelompokPendapatan} target={model} setTarget={setModel} field="belanjaPerBulan" />
                    </Row>
                    <Row label="- Belanja konsumsi per bulan:">
                        <Numerik model={model} setModel={setModel} field="belanjaKonsumsi" />
                    </Row>
                    <Row label="- Belanja kesehatan per bulan:">
                        <Numerik model={model} setModel={setModel} field="belanjaKesehatan" />
                    </Row>
                    <Row label="- Belanja pendidikan per bulan:">
                        <Numerik model={model} setModel={setModel} field="belanjaPendidikan" />
                    </Row>
                    <Row label="- Belanja komunikasi per bulan:">
                        <Numerik model={model} setModel={setModel} field="belanjaKomunikasi" />
                    </Row>
                    <Row label="- Belanja transportasi per bulan:">
                        <Numerik model={model} setModel={setModel} field="belanjaTransportasi" />
                    </Row>
                    <Row label="- Belanja sewa/kontrak rumah per bulan:">
                        <Numerik model={model} setModel={setModel} field="belanjaSewaRumah" />
                    </Row>
                    <Row label="- Bayar angsuran per bulan:">
                        <Numerik model={model} setModel={setModel} field="belanjaCicilan" />
                    </Row>
                    <Row label="- Belanja Listrik per bulan:">
                        <Numerik model={model} setModel={setModel} field="belanjaListrik" />
                    </Row>
                    <Row label="- Belanja Lainnya per bulan:">
                        <Numerik model={model} setModel={setModel} field="belanjaLainnya" />
                    </Row>
                    
                    <tr><td colSpan="2" >&nbsp;</td></tr>
                    
                    <Row label="21. Kepemilikan tabungan:">
                        <Select 
                            target={model} setTarget={setModel} field="tabungan" 
                            options={[
                                'Memiliki',
                                'Tidak memiliki',
                            ]} 
                            effect={() => {
                                setModel(m => ({...m, jumlahTabungan: 0, tempatTabungan: ''}))
                                // setModel(m => ({...m, tempatTabungan: ''}))
                            }}
                        />
                    </Row>
                    <Row label="- Besar tabungan:">
                        <Numerik model={model} setModel={setModel} field="jumlahTabungan" disabled={model.tabungan != 'Memiliki'} />
                    </Row>
                    <Row label="- Tempat menabung:">
                        <Textual model={model} setModel={setModel} field="tempatTabungan" disabled={model.tabungan != 'Memiliki'} />
                    </Row>
                    
                    <tr><td colSpan="2" >&nbsp;</td></tr>
                    
                    <Row label="22. Kecukupan pendapatan:">
                        <Select 
                            target={model} setTarget={setModel} field="kecukupanPendapatan" 
                            options={[
                                'Cukup',
                                'Tidak cukup',
                            ]} 
                            effect={() => setModel(m => ({...m, caraPemenuhanKebutuhan: ''}))}
                        />
                    </Row>
                    <Row label="- Cara memenuhi kebutuhan:">
                        <Textual model={model} setModel={setModel} field="caraPemenuhanKebutuhan" disabled={model.kecukupanPendapatan != 'Tidak cukup'} />
                    </Row>
                    
                    <Row label="">
                        {editable && !submitting && <ButtonSave clickHandler={saveEkonomi} dirty={isDirty()} />}
                        <ButtonSubmit submitting={submitting} />
                    </Row>
                </tbody>
            </table>
            {/* <pre className="text-[10px] text-red-500">{JSON.stringify(model, null, 2)}</pre> */}
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