#!/usr/bin/env python3
import numpy as np
import h5py
from pathlib import Path

base = Path.home() / "scratch"
input_file  = base / "index.h5"
output_file = base / "top30.h5"
cutoff_limit, lower_bound = 30, 50_000

fd = h5py.File(input_file, "r", swmr=True)
def trailing_streak(x: np.ndarray, min_val: float) -> int:
    cnt = 0
    for v in x[::-1]:
        if v > min_val:
            cnt += 1
        else:
            break
    return cnt

dates = fd["/trading_days.txt"][:].astype(str)
instruments = fd["/instruments.txt"][:].astype(str)

D, I = len(dates), len(instruments)
A = np.zeros((D, I), dtype=np.float64)

for day, date in enumerate(dates):
    path = f"/stats/{date}/trade_size"
    if path in fd:
        count = np.asarray(fd[path][()]).ravel()
        n = min(I, count.size)
        A[day, :n] = count[:n]

# Step 2: Compute trailing streak length for each instrument
streak_lengths = np.array([trailing_streak(A[:, i], lower_bound) for i in range(A.shape[1])])

# Step 3: Rank instruments by streak length
# DO NOT USE: it is not a stable sort, will diverge from julia implementation
#     order = np.argsort(-streak_lengths) 
order = np.lexsort((np.arange(len(streak_lengths)), -streak_lengths))

selection = order[:cutoff_limit]
h5_instruments = instruments[selection]
h5_trading_days = dates[-streak_lengths[selection].min():]

# Step 4: write result
str_dtype = h5py.string_dtype(encoding="utf-8")
with h5py.File(output_file, "w") as fd_out:
    fd_out.create_dataset("/instruments.txt", data=h5_instruments.astype(object), dtype=str_dtype)
    fd_out.create_dataset("/trading_days.txt", data=h5_trading_days.astype(object), dtype=str_dtype)
