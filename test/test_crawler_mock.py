from pathlib import Path

import pytest

from core.scraping.parsers.maybe_baby import parse_html as parse_maybe_baby

BASE_DIR = Path(__file__).resolve(strict=True).parent


@pytest.fixture(scope="function")
def html_output(monkeypatch):
    def mock_get_load_time():
        return "mocked!"

    monkeypatch.setattr({}, "get_load_time", mock_get_load_time)
    with open(Path(BASE_DIR).joinpath("test.html"), encoding="utf-8") as f:
        html = f.read()
        yield parse_maybe_baby(html)


def test_output_is_not_none(html_output):
    assert html_output


def test_output_is_a_list(html_output):
    assert isinstance(html_output, list)


def test_output_is_a_list_of_dicts(html_output):
    assert all(isinstance(elem, dict) for elem in html_output)
