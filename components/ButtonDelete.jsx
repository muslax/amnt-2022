export default function ButtonDelete ({ clickHandler }) {
    return <button onClick={clickHandler} className="h-9 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-5">Delete</button>
}