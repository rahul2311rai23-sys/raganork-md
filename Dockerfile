FROM node:22-alpine

# Zaroori system dependencies
RUN apk add --no-cache \
    git \
    ffmpeg \
    libwebp-tools \
    python3 \
    py3-pip \
    make \
    g++

# Repo clone karein
RUN git clone -b main https://github.com/souravkl11/raganork-md /rgnk
WORKDIR /rgnk

# Environment setup
ENV TZ=Asia/Kolkata

# Install dependencies (Ek-ek karke taaki error na ho)
RUN npm install -g pm2
RUN npm install --omit=dev
RUN pip install -U yt-dlp --break-system-packages

# Bot start
CMD ["pm2-runtime", "index.js"]
