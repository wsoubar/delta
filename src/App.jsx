import { useState, useEffect } from 'react';
import ContatoForm from './components/ContatoForm';
import ContatoLista from './components/ContatoLista';
import './App.css';

const STORAGE_KEY = "contatos";

function App() {
  // Carrega os contatos do localStorage
  const [contatos, setContatos] = useState(() => {
    try {
      const storedContatos = localStorage.getItem(STORAGE_KEY);
      return storedContatos ? JSON.parse(storedContatos) : [];
    } catch (error) {
      console.error("Erro ao carregar contatos do localStorage", error);
      return [];
    }
  });

  // Estado para controlar o contato que está sendo editado (null se estiver em modo 'novo')
  const [contatoEdicao, setContatoEdicao] = useState(null);
  // Estado para o filtro de busca pelo nome
  const [filtro, setFiltro] = useState('');
  // Estado para a mensagem de sucesso
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  // Remove a mensagem de sucesso automaticamente
  useEffect(() => {
    if (!mensagemSucesso) return;
    const timer = setTimeout(() => setMensagemSucesso(''), 3000);
    return () => clearTimeout(timer);
  }, [mensagemSucesso]);

  // Função para salvar os contatos no localStorage em cada alteração
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contatos));
    } catch (error) {
      console.error("Erro ao salvar contatos no localStorage", error);
    }
  }, [contatos]);

  // --- Funções de CRUD ---

  // Adiciona ou Atualiza contato
  const handleSaveContato = (formData) => {
    if (contatoEdicao) {
      // Edição: Substitui o contato existente
      setContatos(contatos.map(c => 
        c.id === contatoEdicao.id ? { ...formData, id: c.id } : c
      ));
      // Volta ao modo de criação
      setContatoEdicao(null);
    } else {
      // Criação: Adiciona novo contato
      const novoContato = {
        ...formData,
        id: Date.now(), // ID simples baseado no timestamp
      };
      setContatos([...contatos, novoContato]);
      setMensagemSucesso('Contato adicionado com sucesso!');
    }
  };

  // Prepara o formulário para edição
  const handleEditContato = (contato) => {
    setContatoEdicao(contato);
  };

  // Exclui contato após pedir confirmação (simulada aqui)
  const handleDeleteContato = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este contato?")) {
      setContatos(contatos.filter(c => c.id !== id));
    }
  };

  // Reseta o formulário ao cancelar edição
  const handleCancelEdit = () => {
    setContatoEdicao(null);
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="eyebrow">Sua agenda, em um só lugar</p>
        <h1>Contatos</h1>
        <p className="app-subtitle">Organize e encontre seus contatos com facilidade.</p>
      </header>

      {mensagemSucesso && (
        <div className="success-message" role="status">
          {mensagemSucesso}
        </div>
      )}

      {/* Formulário de Cadastro/Edição */}
      <ContatoForm
        key={contatoEdicao?.id ?? 'novo'}
        currentContato={contatoEdicao} 
        onSave={handleSaveContato} 
        onCancel={handleCancelEdit} 
      />

      {/* Filtro de Busca */}
      {/* Lista de Contatos */}
      <ContatoLista 
        contatos={contatos} 
        onEdit={handleEditContato} 
        onDelete={handleDeleteContato} 
        filter={filtro}
        onFilterChange={setFiltro}
      />
    </main>
  );
}

export default App;