import { useState } from 'react';

const formatTelefone = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;

  let result = `(${digits.slice(0, 2)}) ${digits[2]}`;
  if (digits.length > 3) result += ` ${digits.slice(3, 7)}`;
  if (digits.length > 7) result += `-${digits.slice(7, 11)}`;

  return result;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateField = (name, value) => {
  switch (name) {
    case 'nome':
      return value.trim() ? null : 'O nome é obrigatório.';

    case 'email': {
      if (!value) return null;
      return emailRegex.test(value) ? null : 'Por favor, insira um e-mail válido.';
    }

    case 'telefone': {
      if (!value) return null;
      const digits = value.replace(/\D/g, '');
      return digits.length === 11
        ? null
        : 'Informe um telefone no formato (99) 9 9999-9999.';
    }

    default:
      return null;
  }
};

const ContatoForm = ({ currentContato, onSave, onCancel }) => {
  const [formData, setFormData] = useState(() => currentContato
    ? {
        nome: currentContato.nome,
        email: currentContato.email,
        telefone: formatTelefone(currentContato.telefone || ''),
        cidade: currentContato.cidade
      }
    : { nome: '', email: '', telefone: '', cidade: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const emailStatus = formData.email
    ? (emailRegex.test(formData.email) ? 'valid' : 'invalid')
    : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextValue = name === 'telefone' ? formatTelefone(value) : value;

    setFormData(prev => ({ ...prev, [name]: nextValue }));

    // Revalida em tempo real (após o campo já ter sido tocado)
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, nextValue) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validate = () => {
    const tempErrors = {
      nome: validateField('nome', formData.nome),
      email: validateField('email', formData.email),
      telefone: validateField('telefone', formData.telefone)
    };

    setErrors(tempErrors);
    setTouched({ nome: true, email: true, telefone: true });

    return Object.values(tempErrors).every(error => !error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
      // Limpa o resetar o formulário após salvar, exceto se estiver no modo de edição
      if (!currentContato) {
        setFormData({ nome: '', email: '', telefone: '', cidade: '' });
        setTouched({});
        setErrors({});
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-panel">
      <h2>{currentContato ? 'Editar Contato' : 'Adicionar Novo Contato'}</h2>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="nome">Nome</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Nome completo"
            aria-invalid={Boolean(errors.nome)}
            aria-describedby={errors.nome ? 'nome-error' : undefined}
          />
          {errors.nome && <span id="nome-error" className="field-error">{errors.nome}</span>}
        </div>

        <div className="form-field">
          <div className="field-label-row">
            <label htmlFor="email">E-mail</label>
            {emailStatus && (
              <span
                id="email-status"
                className={`field-status field-status-${emailStatus}`}
              >
                {emailStatus === 'valid' ? 'válido' : 'inválido'}
              </span>
            )}
          </div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="email@exemplo.com"
            aria-invalid={emailStatus === 'invalid'}
            aria-describedby={emailStatus ? 'email-status' : undefined}
          />
        </div>

        <div className="form-field">
          <label htmlFor="telefone">Telefone</label>
          <input
            type="tel"
            id="telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="(99) 9 9999-9999"
            inputMode="numeric"
            maxLength={16}
            aria-invalid={Boolean(errors.telefone)}
            aria-describedby={errors.telefone ? 'telefone-error' : undefined}
          />
          {errors.telefone && <span id="telefone-error" className="field-error">{errors.telefone}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="cidade">Cidade</label>
          <input
            type="text"
            id="cidade"
            name="cidade"
            value={formData.cidade}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Sua cidade"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="button button-primary">
          {currentContato ? 'Salvar alterações' : 'Adicionar contato'}
        </button>
        <button type="button" onClick={onCancel} className="button button-secondary">
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ContatoForm;
