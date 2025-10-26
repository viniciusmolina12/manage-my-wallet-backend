# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app



# Copia arquivos de configuração
COPY package.json yarn.lock ./
COPY tsconfig.json ./

# Instala dependências
RUN yarn install --frozen-lockfile

# Copia código fonte
COPY src ./src

# Build da aplicação
RUN yarn build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Instala Yarn e PM2 globalmente
RUN npm install -g pm2

# Copia arquivos de configuração
COPY package.json yarn.lock ./
COPY ecosystem.config.js ./

# Instala apenas dependências de produção
RUN yarn install --frozen-lockfile --production && yarn cache clean

# Copia arquivos buildados
COPY --from=builder /app/dist ./dist

# Expõe a porta
EXPOSE 3000

# Define variável de ambiente de produção
ENV NODE_ENV=production

# Comando para iniciar com PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]

