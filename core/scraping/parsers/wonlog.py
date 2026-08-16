import logging
import re
from decimal import Decimal, InvalidOperation
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

def _extract_decimal_from_text(text: str) -> Decimal:
    match = re.search(r"\d[\d,]*", text or "")
    if not match:
        return Decimal("0.00")

    numeric = match.group(0).replace(",", "")
    try:
        return Decimal(numeric)
    except (InvalidOperation, ValueError):
        logger.error("Failed to parse price from text: %s", text)
        return Decimal("0.00")


def parse_html(html: str) -> list[dict]:
    soup = BeautifulSoup(html, "html.parser")
    output_list = []
    for row in soup.find_all("li", {"class": "xans-record-"}):
        if row.find("div", attrs={"class": "thumbnail"}) is not None:
            article = dict()
            article["img"] = row.find("div", attrs={"class": "prdImg"}).img["src"]
            article["title"] = row.find("div", class_="name").text.replace("\n", "")
            article["url"] = row.find("div", class_="thumbnail").a["href"]
            article["price"] = Decimal("0.00")
            
            ul_price = row.find("ul", class_="xans-element- xans-product xans-product-listitem spec")
            
            if ul_price:
                fixed_span = ul_price.find(
                    "span",
                    style=re.compile(
                        r"font-size:\s*11px;\s*color:\s*#000000(?:;|$)",
                        re.IGNORECASE,
                    ),
                )
    
                if fixed_span:
                    article["price"] = _extract_decimal_from_text(fixed_span.get_text(" ", strip=True))
                else:
                    # Fallback: 할인판매가
                    discount_li = ul_price.find("li", attrs={"rel": "할인판매가"})
                    if discount_li:
                        discount_span = discount_li.find("span", style=re.compile(r"font-size:\s*12px;\s*color:\s*#555555", re.IGNORECASE))
                        if discount_span:
                            article["price"] = _extract_decimal_from_text(discount_span.get_text(" ", strip=True))
                        else:
                            article["price"] = _extract_decimal_from_text(discount_li.get_text(" ", strip=True))
                    else:
                        # Fallback: 최적할인가
                        best_li = ul_price.find("li", attrs={"rel": "최적할인가"})
                        if best_li:
                            best_span = best_li.find("span", style=re.compile(r"font-size:\s*12px;\s*color:\s*#555555", re.IGNORECASE))
                            if best_span:
                                article["price"] = _extract_decimal_from_text(best_span.get_text(" ", strip=True))
                            else:
                                article["price"] = _extract_decimal_from_text(best_li.get_text(" ", strip=True))
            output_list.append(article)
            logger.info(f"Parsed article: {article['title']}")
    return output_list
