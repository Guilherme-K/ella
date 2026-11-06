function Avatar({ nome, tamanho = 'h-10 w-10', online = false }) {
    const iniciais = nome
        .split(' ')
        .slice(0, 2)
        .map((parte) => parte[0])
        .join('');
 
    return (
        <span
            className={`relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-300 to-violet-400 font-semibold text-white ${tamanho}`}
        >
            {iniciais}
            {online && (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            )}
        </span>
    );
}
 
export default Avatar;
