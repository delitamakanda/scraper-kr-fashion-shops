from core.scraping.parsers.frombeginning import parse_html as parse_frombeginning
from core.scraping.parsers.maybe_baby import parse_html as parse_maybe_baby
from core.scraping.parsers.wonlog import parse_html as parse_wonlog

PARSERS = {
    "from_beginning": parse_frombeginning,
    "maybe_baby": parse_maybe_baby,
    "wonlog": parse_wonlog,
}
