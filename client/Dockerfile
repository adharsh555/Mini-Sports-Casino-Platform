# Build stage
FROM node:20-slim as build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Copy build artifacts to nginx public directory
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
