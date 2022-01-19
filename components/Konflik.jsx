import fetchJson from 'lib/fetchJson';
import { NewKonflik } from 'lib/models';
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

export default function Konflik ({ idr, editable }) {
    const { mutate } = useSWRConfig()
    const { data, error } = useSWR(`/api/get?q=konflik&id=${idr}`, fetchJson)
    const [model, setModel] = useState(NewKonflik('NEW'));
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
    
    async function saveKonflik() {
        setSubmitting(true)
        try {
            await fetchJson("/api/post?q=save-konflik", generatePOSTData({
                idr: idr,
                data: model
            }))
            mutate(`/api/get?q=konflik&id=${idr}`)
        } catch (error) {
            alert("ERROR")
        }
        setSubmitting(false)
    }
    
    return (
        <div className="my-10">
            <h3 className="text-blue-500 font-bold mb-3">Konflik</h3>
            
            <table className="w-full text-sm">
                <tbody>
                    <Row label="50.&nbsp;Konflik 5 tahun terakhir:">
                        <Select 
                            target={model} setTarget={setModel} field="konflik" 
                            options={[
                                'Ada/pernah',
                                'Tidak ada',
                                'Tidak tahu',
                            ]} 
                        />
                    </Row>
                    <Row label="- Penjelasannya:">
                        <Textual model={model} setModel={setModel} field="infoKonflik" />
                    </Row>
                    
                    <Row label="51.&nbsp;Konflik horisontal:">
                        <Textual model={model} setModel={setModel} field="konflikHorisontal" />
                    </Row>
                    
                    <Row label="52.&nbsp;Konflik vertikal:">
                        <Textual model={model} setModel={setModel} field="konflikVertikal" />
                    </Row>
                    
                    <Row label="53.&nbsp;Tokoh yang dipercaya:">
                        <Textual model={model} setModel={setModel} field="tokohResolusi" />
                    </Row>
                    
                    <Row label="">
                        {editable && !submitting && <ButtonSave clickHandler={saveKonflik} dirty={isDirty()} />}
                        <ButtonSubmit submitting={submitting} />
                    </Row>
                </tbody>
            </table>
            
            {/* <pre className="text-xs text-red-600 my-5">{JSON.stringify(model, null, 2)}</pre> */}
        </div>
    )
}