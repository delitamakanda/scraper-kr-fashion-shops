from pathlib import Path

import pytest

from core.scrapers import scrapers

BASE_DIR = Path(__file__).resolve(strict=True).parent


@pytest.fixture(scope="module")
def html_output():
    with open(Path(BASE_DIR).joinpath("test.html"), encoding="utf-8") as f:
        html = f.read()
        yield scrapers.parse_html(html)


def test_output_is_not_none(html_output):
    assert html_output


def test_output_is_a_list(html_output):
    assert isinstance(html_output, list)


def test_output_is_a_list_of_dicts(html_output):
    assert all(isinstance(elem, dict) for elem in html_output)