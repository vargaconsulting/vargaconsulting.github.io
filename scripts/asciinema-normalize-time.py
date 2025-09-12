#!/usr/bin/env python3
import json
import sys
from pathlib import Path

def normalize_sessions(input_path, output_path, total_duration=60.0):
    with open(input_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    header = lines[0].strip()
    event_lines = [line.strip() for line in lines[1:] if line.strip()]
    num_events = len(event_lines)

    print(f"📊 Found {num_events} asciinema events over {total_duration} seconds")

    # Evenly space timestamps
    new_events = []
    for i, line in enumerate(event_lines):
        try:
            event = json.loads(line)
            if isinstance(event, list) and len(event) == 3:
                event[0] = round(i * total_duration / num_events, 6)
                new_events.append(event)
            else:
                print(f"⚠️ Skipping malformed event at line {i+2}: {line}")
        except json.JSONDecodeError:
            print(f"❌ JSON decode error at line {i+2}: {line}")

    # Write output
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(header + "\n")
        f.write(json.dumps({}) + "\n")
        for event in new_events:
            f.write(json.dumps(event) + "\n")

    print(f"✅ Normalized {len(new_events)} events written to {output_path}")

# CLI entry point
if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: asciinema-normalize-time.py input.cast output.cast [total_duration_seconds]")
        sys.exit(1)

    input_cast = Path(sys.argv[1])
    output_cast = Path(sys.argv[2])
    duration = float(sys.argv[3]) if len(sys.argv) > 3 else 60.0

    normalize_sessions(input_cast, output_cast, duration)
