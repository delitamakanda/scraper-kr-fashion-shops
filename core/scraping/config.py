from dataclasses import dataclass


@dataclass(frozen=True)
class ScrapingConfig:
    key: str
    name: str
    base_url: str
    wait_selector_type: str
    wait_selector_value: str
    output_filename: str
    max_attempts: int = 3


MAYBE_BABY = ScrapingConfig(
    key="maybe_baby",
    name="Maybe Baby",
    base_url="https://en.maybe-baby.co.kr/category/new-in/173/",
    wait_selector_type="id",
    wait_selector_value="contents_product",
    output_filename="output.csv",
)

FROM_BEGINNING = ScrapingConfig(
    key="from_beginning",
    name="From Beginning",
    base_url="https://en.frombeginning.kr/",
    wait_selector_type="id",
    wait_selector_value="contents",
    output_filename="output2.csv",
)

WONLOG = ScrapingConfig(
    key="wonlog",
    name="Wonlog",
    base_url="https://wonlog.co.kr/product/list.html?cate_no=58",
    wait_selector_type="id",
    wait_selector_value="contents",
    output_filename="output3.csv",
)

SCRAPERS = {cfg.key: cfg for cfg in (MAYBE_BABY, FROM_BEGINNING, WONLOG)}
