FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN (npm ci || npm install) && npm cache clean --force

COPY . .

ARG VITE_API_BASE_URL=/api/v1

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build


FROM nginx:1.27-alpine AS runtime

RUN addgroup -S webgroup \
    && adduser -S webuser -G webgroup

COPY --chown=webuser:webgroup --from=build /app/dist /usr/share/nginx/html
COPY --chown=webuser:webgroup nginx/default.conf /etc/nginx/conf.d/default.conf

RUN touch /var/run/nginx.pid \
    && chown -R webuser:webgroup /var/run/nginx.pid \
    && chown -R webuser:webgroup /var/cache/nginx

USER webuser

EXPOSE 8080

HEALTHCHECK \
    --interval=30s \
    --timeout=5s \
    --start-period=10s \
    --retries=3 \
    CMD wget --spider --quiet http://127.0.0.1:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]