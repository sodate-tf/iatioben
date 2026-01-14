"use client"
import React, { useState, useEffect } from 'react'; // 👈 Importa useEffect
import { useRouter } from 'next/navigation'; 
import { useAuth } from '../adminTioBen/contexts/AuthContext';


const HomePageAdmin = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Puxa o estado e a função do contexto
    const { login, isAuthenticated } = useAuth(); 
    const router = useRouter(); 

    // 1. CORREÇÃO: Monitora o estado de autenticação para redirecionar
    useEffect(() => {
        if (isAuthenticated) {
            // Usa router.replace para evitar que o usuário volte para o login
            // O caminho '/adminTioBen/posts' é geralmente a home do admin
            router.replace('/adminHome'); 
        }
    }, [isAuthenticated, router]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate async login
        setTimeout(() => {
            // Certifique-se de que a senha está limpa com .trim()
            const success = login(password.trim()); 
            
            if (!success) {
                setError('Senha incorreta. Tente novamente.');
            }
            // 2. CORREÇÃO: Remove o router.push() daqui. O useEffect fará o trabalho.
            setIsLoading(false);
        }, 500);
    };

    // ... (restante da UI)
    // Se o usuário já estiver autenticado e esta página tentar carregar, 
    // o useEffect cuidará do redirecionamento.
    if (isAuthenticated) {
        return <div className="flex items-center justify-center min-h-screen">Redirecionando...</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            {/* ... restante do formulário de login ... */}
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center text-primary">IA Tio Ben - Admin Login</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="text-sm font-bold text-gray-600 block">
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-4 py-2 font-bold text-white bg-primary rounded-md hover:bg-blue-800 focus:outline-none focus:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HomePageAdmin;
