# leap-second-simulator

This is the source code for my [leap second simulator](https://qntm.org/files/simulator/index.html). Built using [`t-a-i`](https://github.com/qntm/t-a-i).

<img width="651" height="879" alt="image" src="https://github.com/user-attachments/assets/0aaee99e-f564-442e-9863-73d7be918b5c" />

Screenshot is taken during a simulated replay of the most recent [leap second](https://en.wikipedia.org/wiki/Leap_second), which took place on 31 December 2016. Here we are using the [smear model](https://github.com/qntm/t-a-i?tab=readme-ov-file#smear-model), whereby time is inserted by running [Unix time](https://en.wikipedia.org/wiki/Unix_time) slightly slower than [TAI](https://en.wikipedia.org/wiki/International_Atomic_Time) for 24 Unix hours, from midday to midday.

In this case the smear ran from 12:00:00 Unix time on 31 December 2016 to 12:00:00 Unix time on 1 January 2017, and the difference between TAI and Unix time increased from 36 TAI seconds to 37 TAI seconds over the course of this period. In the screenshot, it is 12:00:02.365 on 31 December 2016, which means the smear has just begun. The difference between TAI and Unix has just started to increase from 36,000,000,000 nanoseconds. Note how the fraction of a second disagrees between TAI and Unix time. Note also that the drift rate is 1,000,000,000 nanoseconds per Unix day, whereas normally it is 0.
