export default function Row ({ label, children }) {
    return (
        <>
            <tr className="align-top">
                <td className="py-2 pr-4 text-xs w-1/3">
                    {label ?? '-'}
                </td>
                <td className="py-1">
                    {children}
                </td>
            </tr>
        </>
    )
}