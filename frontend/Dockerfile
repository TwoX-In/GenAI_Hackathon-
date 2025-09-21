# Stage 1: Build
FROM node:18 AS builder
WORKDIR /app

# Accept build-time variable
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Copy package files
COPY package*.json ./

# Remove lock & node_modules to avoid ARM issues
RUN rm -rf node_modules package-lock.json
RUN npm install

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Stage 2: Serve
FROM node:18-alpine AS runtime
WORKDIR /app

# Install lightweight server to serve static files
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/dist /app/dist

# Set PORT dynamically: use Cloud Run PORT or fallback to 3000 for local
ENV PORT=${PORT:-5173}

# Run the server
CMD ["sh", "-c", "serve -s /app/dist -l $PORT"]
