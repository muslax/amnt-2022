import useSWR from 'swr'
import { useRouter } from 'next/router';
import Layout from 'components/Layout';
import useUser from 'hooks/useUser';
import fetchJson from 'lib/fetchJson';
import Responden from 'components/Responden';
import Ekonomi from 'components/Ekonomi';
import Anggota from 'components/Anggota';
import Aset from 'components/Aset';
import Nelayan from 'components/Nelayan';
import Konflik from 'components/Konflik';
import Kesmas from 'components/Kesmas';
import Observasi from 'components/Observasi';
import Persepsi from 'components/Persepsi';
import Tanaman from 'components/Tanaman';
import Ternak from 'components/Ternak';
import Ikan from 'components/Ikan';
import Hutan from 'components/Hutan';

export default function DataResponden () {
    const { user } = useUser({ redirectTo: '/login' });
    const router = useRouter()
    const { id } = router.query
    
    const { data: responden, error } = useSWR(`/api/get?q=responden&id=${id}`, fetchJson)
    
    // if (! user || ! user.isLoggedIn) return null;
    if (error) return <div>Failed to load</div>
    if (!responden) return <div>Loading...</div>
    
    return (
        <Layout title="Data Responden">
            <h1 className="text-2xl pb-4 border-b border-gray-400">{responden.nama}</h1>
            
            <Responden user={user} responden={responden} editable={responden._user == user._id}/>
            <Anggota    idr={responden._id} editable={responden._user == user._id}/>
            <Ekonomi    idr={responden._id} editable={responden._user == user._id}/>
            <Aset       idr={responden._id} editable={responden._user == user._id}/>
            <Tanaman    idr={responden._id} editable={responden._user == user._id}/>
            <Ternak     idr={responden._id} editable={responden._user == user._id}/>
            <Ikan       idr={responden._id} editable={responden._user == user._id}/>
            <Hutan      idr={responden._id} editable={responden._user == user._id}/>
            <Nelayan    idr={responden._id} editable={responden._user == user._id}/>
            <Konflik    idr={responden._id} editable={responden._user == user._id}/>
            <Kesmas     idr={responden._id} editable={responden._user == user._id}/>
            <Observasi  idr={responden._id} editable={responden._user == user._id}/>
            <Persepsi   idr={responden._id} editable={responden._user == user._id}/>
        </Layout>
    )
}
