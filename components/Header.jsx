
import Link from "next/link";
import useUser from "hooks/useUser"
import fetchJson from "lib/fetchJson";

export default function Header () {
    const { user, mutateUser } = useUser();
    
    async function handleLogout(e) {
        e.preventDefault()
        await mutateUser(fetchJson("/api/logout", { method: 'POST' }))
    }
    
    return (
        <div className="py-4 border-b border-gray-400">
            <div className="flex items-center">
                <div className="flex-grow text-blue-600 font-bold">
                    <Link href="/">
                        <a className="hover:text-blue-800">
                        Survey Rumah Tangga<br/>PT AMNT - 2022
                        </a>
                    </Link>
                </div>
                <div className="flex items-center space-x-2 pl-4 text-sm">
                    <p>{user.fullname}</p>
                    <button onClick={handleLogout} className="rounded border border-gray-300 focus:outline-none focus:border-red-500 hover:border-red-500 hover:text-red-500 px-3 py-1">Logout</button>
                </div>
            </div>
        </div>
    )
}