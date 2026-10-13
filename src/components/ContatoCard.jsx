const ContatoCard = ({ contato, onEdit, onDelete }) => {
  return (
    <article className="contact-card">
      <h3>{contato.nome}</h3>
      <dl className="contact-details">
        <div><dt>E-mail</dt><dd>{contato.email || 'Não informado'}</dd></div>
        <div><dt>Telefone</dt><dd>{contato.telefone || 'Não informado'}</dd></div>
        <div><dt>Cidade</dt><dd>{contato.cidade || 'Não informada'}</dd></div>
      </dl>
      <div className="card-actions">
        <button type="button" onClick={() => onEdit(contato)} className="button button-edit">Editar</button>
        <button type="button" onClick={() => onDelete(contato.id)} className="button button-delete">Excluir</button>
      </div>
    </article>
  );
};

export default ContatoCard;