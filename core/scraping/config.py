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
