import { useEffect, useState } from 'react';
import Layout from "components/Layout";
import useUser from "hooks/useUser";
import Link from "next/link";
import NewName from 'components/NewName';
import DaftarResponden from 'components/Daftar';

export default function NewResponden() {
    const { user } = useUser({ redirectTo: '/login' });
    
    const [show, setShow] = useState(false)
    const [nama, setNama] = useState(null)
    const [confirm, setConfirm] = useState(false)
    
    if (! user || ! user.isLoggedIn) return null;
    
    return (
        <Layout title="New Responden">
            <NewName />
            
            <DaftarResponden user={user}/>
            
        </Layout>
    )
}