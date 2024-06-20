# Use Node.js 21 on Alpine Linux as build stage
FROM node:21-alpine as build

# Copy package files and install dependencies
COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

# Copy the rest of the application source code and build
COPY . .
RUN npm run build

# Use Node.js 21 on Alpine Linux as final stage
FROM node:21-alpine as final

# Copy compiled application from build stage
COPY --from=build ./dist ./dist
COPY --from=build ./node_modules ./dist/node_modules

# Copy package.json and environment file
COPY --from=build package.json ./dist/package.json
COPY --from=build package-lock.json ./dist/package-lock.json
COPY --from=build ./src/firebase-admin-cred.json ./dist/firebase-admin-cred.json
COPY .env .env

ENV GOOGLE_APPLICATION_CREDENTIALS=dist/firebase-admin-cred.json

# Expose port 8000 (if necessary, can be omitted if using Docker host network)
EXPOSE 8000

CMD ["node" , "./dist/index.js"]

