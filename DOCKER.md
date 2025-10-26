# Docker Setup

Este projeto inclui configuração Docker para facilitar o desenvolvimento e deploy.

## Arquivos Docker

- `Dockerfile`: Imagem da aplicação com multi-stage build
- `docker-compose.yml`: Orquestração com MongoDB
- `.dockerignore`: Arquivos excluídos do build

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017/manage-my-wallet

# JWT Secret Key
SECRET_KEY=your-secret-key-here

# Email Configuration
FROM_EMAIL=your-email@example.com
RESET_PASSWORD_URL=http://localhost:3000/reset-password
MAILER_HOST=smtp.gmail.com
MAILER_PORT=587
MAILER_AUTH_USER=your-email@example.com
MAILER_AUTH_PASSWORD=your-app-password
```

## Como Usar

### Opção 1: Docker Compose (Recomendado)

Para subir a aplicação com MongoDB:

```bash
docker-compose up -d
```

Para ver os logs:

```bash
docker-compose logs -f app
```

Para parar:

```bash
docker-compose down
```

### Opção 2: Docker Build

Para construir a imagem manualmente:

```bash
# Build
docker build -t manage-my-wallet-api .

# Run (adicione as variáveis de ambiente ou use o .env)
docker run -p 3000:3000 --env-file .env manage-my-wallet-api
```

## Acessos

- API: http://localhost:3000
- MongoDB: localhost:27017

## Notas

- A aplicação usa Yarn como gerenciador de pacotes
- A aplicação usa PM2 para gerenciamento de processos
- Os dados do MongoDB são persistidos em um volume Docker
- A imagem base é Alpine Linux para reduzir o tamanho
- Multi-stage build reduz o tamanho final da imagem
