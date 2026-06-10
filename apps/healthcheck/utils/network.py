import subprocess

def ping_host(host: str) -> bool:
    try:
        output = subprocess.run(
            ['ping', '-c', '1', '-W', '1', host],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        return output.returncode == 0
    except subprocess.CalledProcessError:
        return False