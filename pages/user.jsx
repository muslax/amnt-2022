import useUser from "hooks/useUser"

export default function UserPage() {
    const { user } = useUser({ redirectTo: '/login' })
    
    if (!user || !user.isLoggedIn) return null;
    
    return (
        <div>USER PAGE</div>
    )
}