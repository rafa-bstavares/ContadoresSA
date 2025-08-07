# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./

# Instala dependências com cache limpo
RUN npm ci

# Copia código fonte
COPY . .

# Build da aplicação React
# Adiciona ARG para passar variáveis de build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Production stage
FROM nginx:alpine

# Instala curl para healthcheck
RUN apk add --no-cache curl

# Remove config padrão do nginx
RUN rm -rf /etc/nginx/conf.d/*

# Copia arquivos estáticos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia nossa configuração customizada
COPY nginx.config /etc/nginx/conf.d/default.conf

# Cria usuário não-root
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Muda para usuário não-root
USER nginx

# Expõe porta 80
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Nginx já inicia automaticamente
CMD ["nginx", "-g", "daemon off;"]
