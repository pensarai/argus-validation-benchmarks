FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    openssh-server \
    python3 \
    curl \
    net-tools \
    xxd \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir /var/run/sshd

COPY src/ /opt/setup/
COPY bin/ /opt/bin/
RUN chmod +x /opt/setup/entrypoint.sh

EXPOSE 22

CMD ["/opt/setup/entrypoint.sh"]
