#!/usr/bin/env python3
import json
import re
import sys
import argparse

def main():
    parser = argparse.ArgumentParser(
        description="Strip ANSI colors from Asciinema .cast JSONL recordings"
    )
    parser.add_argument("input", help="Input .cast file")
    parser.add_argument(
        "--mode",
        choices=["all", "backgrounds", "foregrounds"],
        default="all",
        help="Which colors to strip (default: all)"
    )
    args = parser.parse_args()

    # Regex patterns
    ansi_all = re.compile(r'\x1b\[[0-9;]*m')
    ansi_bg = re.compile(r'\x1b\[(4[0-7]|10[0-7])m')
    ansi_fg = re.compile(r'\x1b\[(3[0-7]|9[0-7])m')

    def strip_codes(s: str) -> str:
        if args.mode == "all":
            return ansi_all.sub("", s)
        elif args.mode == "backgrounds":
            return ansi_bg.sub("", s)
        elif args.mode == "foregrounds":
            return ansi_fg.sub("", s)
        return s

    try:
        with open(args.input, "r", encoding="utf-8") as f:
            for line in f:
                line = line.rstrip("\n")
                if not line:
                    continue

                obj = json.loads(line)

                # Events are arrays, header is dict
                if isinstance(obj, list) and len(obj) >= 3 and obj[1] == "o":
                    obj[2] = strip_codes(obj[2])

                # Emit cleaned JSONL line
                json.dump(obj, sys.stdout, ensure_ascii=False)
                sys.stdout.write("\n")

    except Exception as e:
        print(f"Error processing {args.input}: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
