# Stage 1: Build the React app
FROM node:21-alpine as build
WORKDIR /app

# Copy package files and install dependencies
COPY package.json .
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the React app
RUN npm run build -- --mode development

# Stage 2: Serve the app with Nginx
FROM nginx:alpine as final

# Copy built files from the build stage to the Nginx www directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
