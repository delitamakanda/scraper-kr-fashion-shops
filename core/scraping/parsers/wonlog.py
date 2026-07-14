import logging
import re

from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)


def parse_html(html):
    soup = BeautifulSoup(html, "html.parser")
    output_list = []
    for row in soup.find_all("li", {"class": "xans-record-"}):
        if row.find("div", attrs={"class": "thumbnail"}) is not None:
            article = dict()
            article["img"] = row.find("div", attrs={"class": "prdImg"}).img["src"]
            article["title"] = row.find("div", class_="name").text.replace("\n", "")
            article["url"] = row.find("div", class_="thumbnail").a["href"]
            ul_price = row.find(
                "ul", class_="xans-element- xans-product xans-product-listitem spec"
            )
            if ul_price:
                li_price = ul_price.find_all("li") if len(ul_price.find_all("li")) > 1 else None
                for li in li_price:
                    price_span = li.find_all(
                        "span", style=re.compile(r"font-size:11px;color:#000000;")
                    ) or li.find_all("span", style=re.compile(r"font-size:12px;color:#555555;"))
                    for span in price_span:
                        second_span = re.compile(r"\d+\,\d+").findall(span.text)
                        for p in second_span:
                            formatted_price = p.replace(",", ".")
                            try:
                                article["price"] = float(formatted_price)
                            except ValueError:
                                logger.error(f"Failed to parse price: {formatted_price}")
                                article["price"] = "0.00"
            output_list.append(article)
            logger.info(f"Parsed article: {article['title']}")
    return output_list
