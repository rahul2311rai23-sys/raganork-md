FROM node:22-alpine

# System dependencies
RUN apk add --no-cache git ffmpeg libwebp-tools python3 py3-pip

# Working directory
WORKDIR /rgnk

# Copy files (Note: Aapko apne GitHub repo mein `package.json` file honi chahiye)
RUN git clone -b main https://github.com/souravkl11/raganork-md .

# Install dependencies in a memory-efficient way
RUN npm install --omit=dev --no-audit --no-fund && \
    pip install -U yt-dlp --break-system-packages

# Start command
CMD ["node", "index.js"]
