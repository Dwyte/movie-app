# Build Stage
FROM node:22 AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --frozen-lockfile

COPY . .

# Accept build-time arguments for Vite
ARG VITE_BASE="/"
ARG VITE_TMDB_API_KEY_V4
ARG VITE_TMDB_API_KEY_V3

# Create .env dynamically for Vite
RUN echo "VITE_BASE=$VITE_BASE" > .env && \
    echo "VITE_TMDB_API_KEY_V4=$VITE_TMDB_API_KEY_V4" >> .env && \
    echo "VITE_TMDB_API_KEY_V3=$VITE_TMDB_API_KEY_V3" >> .env

RUN npm run build

# Production Stage
FROM nginx:stable-alpine AS production

COPY --from=build /app/dist /app/dist
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
