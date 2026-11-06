import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

function AgradecimentoVoluntaria() {
    const navigate = useNavigate();
    const [segundos, setSegundos] = useState(10);

    useEffect(() => {
        if (segundos === 0) {
            navigate('/');
            return;
        }
        const timer = setTimeout(() => setSegundos((s) => s - 1), 1000);
        return () => clearTimeout(timer);
    }, [segundos, navigate]);

    return (
        <main className="bg-[#f3e8ff] min-h-[60vh] flex items-center justify-center px-4 py-16">
            <section className="bg-white rounded-3xl shadow-lg max-w-lg w-full p-10 text-center">
                <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="text-6xl text-[#7e22ce] animate-bounce mb-4"
                />
                <h1 className="text-3xl font-bold text-[#4c1d95] mb-3">
                    Obrigada por querer ajudar!
                </h1>
                <p className="mb-2">Recebemos o seu interesse em ser voluntária.</p>
                <p className="mb-6">Em breve nossa equipe entrará em contato com os próximos passos.</p>
                <p className="text-sm text-[#7e22ce] mb-4">
                    Você será levada para a página inicial em {segundos}s.
                </p>
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="rounded-full text-white bg-pink-400 px-8 py-2 font-semibold"
                >
                    Voltar ao início
                </button>
            </section>
        </main>
    );
}

export default AgradecimentoVoluntaria;