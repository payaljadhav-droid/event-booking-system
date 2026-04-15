# Use Node.js 20
FROM node:20

# Set working dir
WORKDIR /src

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 4000

# Default command
CMD ["npm", "run", "dev"]
