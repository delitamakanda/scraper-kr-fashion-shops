import platform
import shutil

import psutil


def get_system_status():
    return {
        "host_name": platform.node(),
        "cpu_percent": psutil.cpu_percent(interval=1),
        "memory": {
            "total": psutil.virtual_memory().total,
            "available": psutil.virtual_memory().available,
            "percent": psutil.virtual_memory().percent,
        },
        "disk": {
            "total": shutil.disk_usage("/").total,
            "used": shutil.disk_usage("/").used,
            "free": shutil.disk_usage("/").free,
        },
        "uptime_seconds": int(psutil.boot_time()),
    }
