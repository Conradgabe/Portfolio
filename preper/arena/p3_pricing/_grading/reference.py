_BASE = {"widget": 100, "gadget": 250}
_MULTIPLIER = {"standard": 1.0, "gold": 0.8}

_cache = {}


def _compute(product_id, tier):
    return _BASE[product_id] * _MULTIPLIER[tier]


def get_price(product_id, tier):
    key = (product_id, tier)
    if key in _cache:
        return _cache[key]
    result = _compute(product_id, tier)
    _cache[key] = result
    return result
