# build the frontend application
FROM node:22-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
# using npm ci instead of npm install to ensure a clean install of dependencies based on package-lock.json
RUN npm ci
COPY frontend/ ./
RUN npm run build

# create a smaller runtime image
FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
# copy the nginx configuration template for envsubst
COPY frontend/nginx.conf /etc/nginx/templates/default.conf.template
EXPOSE 80
