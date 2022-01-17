export default function ButtonCancel ({ clickHandler }) {
    return <button onClick={clickHandler} 
    className="h-9 bg-yellow-200 hover:bg-yellow-300 text-red-500 text-sm font-medium px-4 ml-2"
    >Cancel</button>
}