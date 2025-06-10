# Use official Node.js image as build environment
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Use nginx to serve the build
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 81

CMD ["nginx", "-g", "daemon off;"]