import useUser from "hooks/useUser";
import fetchJson from "lib/fetchJson";
import useSWR from "swr";

export default function Admin () {
    const { user } = useUser({ redirectTo: '/login' });
    const { data, error } = useSWR(`/api/get?q=progress`, fetchJson)
    
}