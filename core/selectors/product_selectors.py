from logging import getLogger

from core.services.product_services import ProductServices

logger = getLogger(__name__)

class ProductSelectors:
    @staticmethod
    def get_all_products(request=None, *args, **kwargs) -> dict:
        return ProductServices.get_all_products(request=request)
        