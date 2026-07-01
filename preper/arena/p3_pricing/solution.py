_BASE = {"widget": 100, "gadget": 250}
_MULTIPLIER = {"standard": 1.0, "gold": 0.8}   # gold gets 20% off

_cache = {}


def _compute(product_id, tier):
    return _BASE[product_id] * _MULTIPLIER[tier]


def get_price(product_id, tier):
    """Return the price of product_id for the given customer tier (cached)."""
    if product_id in _cache:
        return _cache[product_id]
    result = _compute(product_id, tier)
    _cache[product_id] = result
    return result
