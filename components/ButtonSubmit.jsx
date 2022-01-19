export default function ButtonSubmit(props) {
    if (props.submitting) return (
        <button disabled
        className='submitting h-9 opacity-50 text--white text-sm font-medium px-8'
        >Saving...</button>
    )
    
    return null;
}