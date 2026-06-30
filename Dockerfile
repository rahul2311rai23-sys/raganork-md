FROM node:22-alpine

# Zaroori tools install karna
RUN apk add --no-cache \
    git \
    ffmpeg \
    libwebp-tools \
    python3 \
    make \
    g++ \
    py3-pip

# GitHub se repo clone karna
ADD https://api.github.com/repos/souravkl11/raganork-md/git/refs/heads/main version.json
RUN git clone -b main https://github.com/souravkl11/raganork-md /rgnk

WORKDIR /rgnk

# Folder aur Environment set karna
RUN mkdir -p temp
ENV TZ=Asia/Kolkata

# Node tools aur yt-dlp install karna
RUN npm install -g --force yarn pm2
RUN pip install yt-dlp --break-system-packages

# Dependencies install karna
RUN yarn install

CMD ["npm", "start"]
