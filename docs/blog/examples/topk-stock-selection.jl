using HDF5

base = homedir() * "/scratch"
input_file, output_file = base * "/index.h5", base * "/top30.h5"
cutoff_limit, lower_bound = 30, 50_000

fd = h5open(input_file, "r";  swmr=true)
function trailing_streak(x::AbstractVector{<:Real}, min::Real)
    count = 0
    for val in Iterators.reverse(x)
        val > min ? (count += 1) : break
    end
    return count
end

dates = String.(read(fd["/trading_days.txt"]))
instruments = String.(read(fd["/instruments.txt"]))

D, I = length(dates), length(instruments)
A = zeros(Float64, D, I)

for (day, date) in enumerate(dates)
    path = "/stats/$date/trade_size"
    if haskey(fd, path)
        count = vec(read(fd[path]))
        A[day, 1:length(count)] .= count
    end
end

# Step 2: Compute trailing streak length for each instrument
streak_lengths = [trailing_streak(A[:,i], lower_bound) for i in 1:I]

# Step 3: Rank instruments by streak length
order = sortperm(streak_lengths, rev=true)
selection = order[1:cutoff_limit]
h5_instruments = instruments[selection]
h5_trading_days = dates[end - minimum(streak_lengths[selection]) + 1:end]

# Step 4: Write result
h5open(output_file, "w") do fd
    write(fd, "/instruments.txt", h5_instruments)
    write(fd, "/trading_days.txt", h5_trading_days)
end
