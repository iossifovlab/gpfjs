ARG REGISTRY=""
ARG BASE_IMAGE_TAG=latest
FROM ${REGISTRY}iossifovlab-mamba-base:${BASE_IMAGE_TAG}


# APT DEPENDENCIES
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y build-essential gcc \
        libgl1-mesa-glx procps libsasl2-dev \
        wget curl gnupg lsof xvfb \
        python3-lxml python3-bs4 && \
	apt-get clean

# GOOGLE CHROME
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y ./google-chrome-stable_current_amd64.deb

# NPM
RUN DEBIAN_FRONTEND=noninteractive apt-get update
RUN curl -sL https://deb.nodesource.com/setup_14.x  | bash -
RUN DEBIAN_FRONTEND=noninteractive apt-get -y install nodejs
RUN npm install -g @angular/cli
RUN npm install -g protractor
RUN webdriver-manager update


SHELL ["/bin/bash", "-c"]
