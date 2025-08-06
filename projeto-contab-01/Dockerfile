# STAGE DE BUILD
# rode a imagem do node-slim dentro do container.
FROM node:18-slim AS builder

# Instala dependências que o Prisma e outras libs precisam (pro bcrypt, pra questões internas do prisma de criptografar pra enviar dados, a gente precisa que o ambiente que eles estejam rodando tenha openssl. Como openssl é uma biblioteca de sistema, não do javascript, instalamos com apt-get não com npm)
RUN apt-get update && apt-get install -y \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# Diz para o sistema: todos os comandos dados daqui pra frente, considere q estão sendo dados na pasta app (dentro do container). Caso ela não exista dentro do container o sistema cria
WORKDIR /app

# Copia só o packege,json primeiro. Isso pra caso a nossa mudança não tenha mudança nas bibliotecas, ele não precisa instalar tudo de novo (ele pula por causo da comparação com o cache)
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
# Copia o resto do código
COPY . .

# Avisar ao typescript das tipagens do prisma (não conecta com o banco)
RUN npx prisma generate

# Compilar o código TypeScript em JavaScript
RUN npm run build


# STAGE DE PRODUÇÃO
FROM node:18-slim

# Instala apenas o que é necessário para runtime
RUN apt-get update && apt-get install -y \
    openssl \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Cria usuário não-root
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs    

# Copia arquivos compilados
COPY --from=builder --chown=nodejs:nodejs /app/build ./build
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma

# Muda para usuário não-root
USER nodejs

EXPOSE 3333

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3333/health || exit 1


CMD ["npm", "run", "start"]






