# Tecnolar Website 🏠

Sistema web completo para empresa de construção civil, com frontend público e painel administrativo.

## 🛠️ Tecnologias Utilizadas

- **Frontend**:
  - jQuery 3.7.1 - Manipulação do DOM e AJAX
  - jQuery Mask - Máscaras para inputs (telefone, preço)
  - Mustache.js - Template engine para renderização dinâmica
  - SweetAlert - Alertas e modais elegantes
  - HTML5/CSS3 - Estrutura e estilização
  
- **Backend**:
  - Node.js - Runtime JavaScript
  - MySQL 5.7 - Banco de dados
  - Docker - Containerização

## ✨ Funcionalidades

### 🌐 Site Público (controller.js)

- **Carregamento Dinâmico** 📥
  - Carrega dados do backend para todas as seções
  - Fallback para dados estáticos quando necessário
  - Loading state com feedback visual

- **Seções Dinâmicas** 📄
  - About (Sobre)
  - Features (Características)
  - Models (Modelos)
  - Testimonials (Depoimentos)

- **Formulário de Contato** 📝
  - Validação HTML5
  - Máscara para telefone
  - Feedback visual do envio
  - Tratamento de erros

- **UI/UX** 🎨
  - Navegação suave com scroll
  - Links ativos conforme seção visível
  - Loading states com SweetAlert
  - Feedback visual de ações

### ⚙️ Painel Administrativo (admin.js)

- **Gestão de Conteúdo** 🔧
  - Editor completo para todas as seções
  - Interface intuitiva
  - Validação de dados
  - Feedback visual de ações

- **Features de Edição** 📋
  - Adicionar/Remover parágrafos
  - Gerenciar features com ícones
  - Controle de modelos e preços
  - Gestão de depoimentos

- **Recursos Específicos** 🎯
  - Máscara monetária para preços
  - Upload de imagens via URL
  - Marcação de modelos em destaque
  - Organização de características por modelo

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Docker
- Docker Compose

### Configuração do Backend

1. Clone o repositório
```bash
git clone [url-do-repositorio]
cd ProjetoFinalUnifamma
```

2. Navegue até a pasta do backend
```bash
cd backend
```

3. Inicie os containers com Docker Compose
```bash
docker-compose up -d
```

O comando acima irá:
- Criar e iniciar o container MySQL na porta 3306
- Criar e iniciar o container Node.js na porta 3000
- Configurar as variáveis de ambiente necessárias
- Executar o script de inicialização do banco de dados

### Verificando o Status

Para verificar se os containers estão rodando:
```bash
docker-compose ps
```

### Logs

Para ver os logs dos containers:
```bash
docker-compose logs -f
```

### Parando os Containers

Para parar os containers:
```bash
docker-compose down
```

## 📝 Notas Importantes

- O banco de dados é inicializado com o script em `./bd/init.sql`
- As credenciais do banco estão no `docker-compose.yml`
- O backend está configurado para ambiente de desenvolvimento
- O frontend espera que o backend esteja rodando na porta 3000

## 🔒 Credenciais Padrão

**Banco de Dados**:
- User: admin
- Password: asdf1234
- Database: tecnolar_db

## 🤝 Contribuindo

Para contribuir com o projeto:
1. Fork o repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request