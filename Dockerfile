FROM node:22-alpine

# Zaroori dependencies (pip aur build tools ke saath)
RUN apk add --no-cache \
    git \
    ffmpeg \
    libwebp-tools \
    python3 \
    py3-pip \
    make \
    g++

# Repo clone karna
ADD https://api.github.com/repos/souravkl11/raganork-md/git/refs/heads/main version.json
RUN git clone -b main https://github.com/souravkl11/raganork-md /rgnk

WORKDIR /rgnk

# Temporary folder aur timezone
RUN mkdir -p temp
ENV TZ=Asia/Kolkata

# Node dependencies install (Yarn ki jagah npm use kar rahe hain)
RUN npm install -g pm2
RUN npm install --production --no-audit

# yt-dlp install (Python 3 environment ke liye)
RUN pip install -U yt-dlp --break-system-packages

CMD ["pm2-runtime", "index.js"]
