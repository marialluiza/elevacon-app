import React, { useState } from 'react';
import axios from 'axios';

const AlterarSenha = () => {
    const [novaSenha, setNovaSenha] = useState('');
    const [mensagem, setMensagem] = useState('');

    const alterarSenha = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const token = new URLSearchParams(window.location.search).get('token');
            const response = await axios.post('/api/alterar-senha', { novaSenha, token });
            setMensagem(response.data);
        } catch (error) {
            setMensagem('Erro ao alterar a senha.');
        }
    };

    return (
        <form onSubmit={alterarSenha}>
            <label htmlFor="senha">Nova Senha:</label>
            <input
                type="password"
                id="senha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
            />
            <button type="submit">Alterar Senha</button>
            {mensagem && <p>{mensagem}</p>}
        </form>
    );
};

export default AlterarSenha;
