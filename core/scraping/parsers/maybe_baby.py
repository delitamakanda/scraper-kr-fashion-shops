import logging

from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)


def parse_html(html):
    soup = BeautifulSoup(html, "html.parser")
    output_list = []
    for row in soup.find_all("li", {"class": "xans-record-"}):
        if row.find("div", attrs={"class": "thumbnail"}) is not None:
            article = dict()
            article["img"] = row.find("div", attrs={"class": "prdImg"}).img["src"]
            article["title"] = row.find("div", class_="name").find_all("span")[2].text
            article["url"] = row.find("div", class_="name").a["href"]
            article["price"] = row.find("li", class_="xans-record-").find_all("span")[1].text
            output_list.append(article)
            logger.info(article)
    return output_list
