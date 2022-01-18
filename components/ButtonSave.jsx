export default function ButtonSave ({ clickHandler, dirty = false }) {
    return <button 
        disabled={! dirty}  
        onClick={clickHandler} 
        className="h-9 bg-gray-600 disabled:bg-gray-300 hover:bg-gray-700 text-white text-sm font-medium px-8"
    >Save</button>
}