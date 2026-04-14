FROM coredns/coredns:1.11.1

COPY zones/Corefile /etc/coredns/Corefile
COPY zones/ /etc/coredns/zones/

EXPOSE 53 53/udp

ENTRYPOINT ["/coredns"]
CMD ["-conf", "/etc/coredns/Corefile"]
