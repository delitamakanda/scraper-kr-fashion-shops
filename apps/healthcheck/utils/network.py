import platform
import socket
import subprocess


def tcp_check(host: str, port: int, timeout: int = 2) -> bool:
    try:
        with socket.create_connection((host, port), timeout):
            return True
    except OSError:
        return False


def ping_host(host: str) -> bool:
    param = "-n" if platform.system().lower() == "windows" else "-c"
    output = subprocess.run(
        ['ping', param, '1', host],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    return output.returncode == 0
