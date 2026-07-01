# p3 - Debug: wrong price served after first lookup (35 min)

Pricing is cached for speed. QA found that **once a product is priced for a "gold"
customer, "standard" customers then see the gold price too**, until a restart clears the
cache. `get_price(product_id, tier)` must return the price for THAT tier.

The compute step is correct. The bug is in how results are cached. Fix `solution.py`.

## Run
`python arena/run.py p3`  then  `python arena/run.py p3 --scored`
