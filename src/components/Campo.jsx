function Campo ({label, id, name, type, placeholder, value, onChange, required}) {
    return (
        <div>
        <label className="block mb-2"
        htmlFor={id}
        >
            {label}
        </label>

        <input className="w-full rounded-xl border border-violet-200 bg-[#faf5ff] px-4 py-3 block mb-4"
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        />

        </div>
    )
}

export default Campo;