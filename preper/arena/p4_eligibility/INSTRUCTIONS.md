# p4 - Debug: cancelled accounts still get premium features (35 min)

Cancelled (inactive) accounts still get eligible features if they had trial days left -
a revenue leak. The rule:

> A user is eligible if they are **active** AND (**premium** OR **have trial days left**).

An inactive user must NEVER be eligible. Fix `is_eligible` in `solution.py`.

## Run
`python arena/run.py p4`  then  `python arena/run.py p4 --scored`
