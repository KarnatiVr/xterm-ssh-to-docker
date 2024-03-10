FROM ubuntu:latest

RUN mkdir -p /var/run/sshd

RUN apt update && \
    apt install -y openjdk-8-jdk && \
    apt install -y openssh-server

RUN useradd -rm -d /home/karnativr -s /bin/bash karnativr && \
    echo karnativr:karnativr | chpasswd

COPY id_rsa.pub /home/karnativr/.ssh/authorized_keys

RUN chown karnativr:karnativr -R /home/karnativr/.ssh && \
    chmod 600 /home/karnativr/.ssh/authorized_keys

CMD [ "/usr/sbin/sshd","-D" ]
