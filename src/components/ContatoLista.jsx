import ContatoCard from './ContatoCard';

const ContatoLista = ({ contatos, onEdit, onDelete, filter, onFilterChange }) => {
  // Aplica o filtro de busca em todos os campos
  const termo = filter.trim().toLowerCase();
  const filteredContatos = contatos.filter(contato =>
    [contato.nome, contato.email, contato.telefone, contato.cidade]
      .some(campo => (campo || '').toLowerCase().includes(termo))
  );

  return (
    <section className="contacts-section" aria-labelledby="contacts-title">
      <div className="contacts-heading">
        <h2 id="contacts-title">
          Lista de contatos <span className="contact-count">{filteredContatos.length}</span>
        </h2>
        <input
          type="search"
          className="search-input"
          placeholder="Buscar por nome, e-mail, telefone ou cidade..."
          aria-label="Buscar contato por nome, e-mail, telefone ou cidade"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
        />
      </div>
      <div className="contact-grid">
        {filteredContatos.length === 0 ? (
          <div className="empty-state">
            <p>{filter ? 'Nenhum contato encontrado.' : 'Sua agenda ainda está vazia. Adicione seu primeiro contato acima.'}</p>
          </div>
        ) : (
          filteredContatos.map(contato => (
            <ContatoCard
              key={contato.id}
              contato={contato}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default ContatoLista;