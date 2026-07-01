# p2 - Debug: scheduler rejects back-to-back bookings (35 min)

The room scheduler refuses two meetings that merely touch. A meeting **9:00-10:00** and
another **10:00-11:00** should both be allowed - the first ends exactly as the second
begins.

Times are integer minutes. Intervals are **half-open `[start, end)`**: a booking occupies
`start` up to but NOT including `end`. Two bookings conflict only if they truly overlap.

Fix `overlaps` (and thus `has_conflict`) in `solution.py`.

## Run
`python arena/run.py p2`  then  `python arena/run.py p2 --scored`
