import imagemMulheres2 from '../assets/mulheres2.png';

function Voluntaria () {
    return (
        <main className="bg-[#f3e8ff]">
        <section className="flex items-center justify-between flex-col md:flex-row px-10 py-10">
            <div>
                <h1 className='text-4xl font-bold text-[#4c1d95]'>Quero ser voluntária</h1>
                <p className='max-w-md'>Faça parte da nossa rede de apoio e ajude a fortalecer outras mulheres.</p>
            </div>
            <img className="max-w-sm"
            src={imagemMulheres2}
            alt='Mulheres'/>
        </section>

        <section className="bg-white rounded-3xl shadow-lg max-w-lg mx-auto p-8 pb-10 mb-10">
            <h2 className="text-2xl font-bold text-[#4c1d95] mb-2">Receba nosso contato por e-mail</h2>
            <p className="mb-2">Preencha seus dados e conte para nós como você gostaria de ajudar.</p>
            <p className="mb-6">Entraremos em contato com os próximos passos.</p>

            <form>
                <label className="block mb-2"
                htmlFor="nome">Nome completo</label>
                <input className="w-full rounded-xl border border-violet-200 bg-[#faf5ff] px-4 py-3 block mb-4"
                type="text" id="" name="" placeholder="Seu nome completo..." />
                </form>
        </section>
        </main>
    );
}

export default Voluntaria;