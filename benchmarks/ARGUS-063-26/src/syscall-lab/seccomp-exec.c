#include <errno.h>
#include <seccomp.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

static int deny(scmp_filter_ctx ctx, int syscall_number) {
    return seccomp_rule_add(ctx, SCMP_ACT_ERRNO(EPERM), syscall_number, 0);
}

int main(int argc, char **argv) {
    if (argc != 3) {
        fprintf(stderr, "usage: seccomp-exec MODE PAYLOAD\n");
        return 64;
    }
    scmp_filter_ctx ctx = seccomp_init(SCMP_ACT_ALLOW);
    if (!ctx || deny(ctx, SCMP_SYS(open)) < 0 || deny(ctx, SCMP_SYS(openat)) < 0) {
        perror("seccomp policy");
        return 70;
    }
#ifdef __NR_openat2
    if (strcmp(argv[1], "hardened") == 0 && deny(ctx, SCMP_SYS(openat2)) < 0) {
        perror("seccomp openat2 policy");
        return 70;
    }
#endif
    if (seccomp_load(ctx) < 0) {
        perror("seccomp_load");
        return 70;
    }
    seccomp_release(ctx);
    char *payload_argv[] = {argv[2], NULL};
    execv(argv[2], payload_argv);
    perror("execv");
    return 71;
}
