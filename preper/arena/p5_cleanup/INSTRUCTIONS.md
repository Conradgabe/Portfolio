# p5 - Debug: nightly cleanup job crashes (35 min)

The nightly job that purges inactive users crashes with
`RuntimeError: dictionary changed size during iteration`. It only crashes when there is
more than one inactive user. `purge_inactive(users)` should remove every inactive user
and return the remaining ones. Fix `solution.py`.

## Run
`python arena/run.py p5`  then  `python arena/run.py p5 --scored`
