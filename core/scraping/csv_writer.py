import csv
from pathlib import Path

FIELDNAMES = ["img", "title", "price", "url"]
BASE_DIR = Path(__file__).resolve(strict=True).parent.parent


def write_to_file(output_list, filename):
    with open(Path(BASE_DIR) / filename, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=FIELDNAMES)
        writer.writeheader()
        writer.writerows(output_list)
