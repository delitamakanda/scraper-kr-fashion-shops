import csv
from pathlib import Path

BASE_DIR = Path(__file__).resolve(strict=True).parent.parent


def write_to_file(output_list, filename):
    with open(Path(BASE_DIR).joinpath(filename), "w", newline="") as csvfile:
        for row in output_list:
            fieldnames = ["img", "title", "price", "url"]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writerow(row)
