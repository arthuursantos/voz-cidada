FROM node:20-alpine as build

WORKDIR /app

# First copy only package files for better caching
COPY package.json package-lock.json ./

# Install dependencies with legacy peer deps
RUN npm ci --legacy-peer-deps

# Copy all other files
COPY . .

# Build the app
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]