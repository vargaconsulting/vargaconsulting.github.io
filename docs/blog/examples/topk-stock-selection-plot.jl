using Printf, Format
import GRUtils: oplot, plot, legend, xlabel, ylabel, title, savefig

colorscheme("solarized light")

thresholds = [20_000, 30_000, 40_000, 50_000, 60_000, 80_000, 100_000]
cutoff_limit,max = 30, 100

compute_streaks(A, min_val) = [trailing_streak(A[:, i], min_val) for i in 1:size(A, 2)]
sorted_streaks_per_threshold = Dict()
for t in thresholds
    streaks = compute_streaks(A, t)
    sorted_streaks_per_threshold[t] = sort(streaks, rev = true)[1:max]
end
plot([cutoff_limit, cutoff_limit], [0, 1000], "-r";
    linewidth=4, linestyle=:dash, xlim=(0, max), xticks=(10, 3), label=" 30")

for t in thresholds[1:end]
    oplot(1:length(sorted_streaks_per_threshold[t]),
          sorted_streaks_per_threshold[t]; label = format("{:>8}",format(t, commas=true)), lw = 2)
end

legend("")
xlabel("Top-N Instruments")
ylabel("Trailing Days Over Threshold")
title("Trailing Active Streaks by Trade Threshold")
