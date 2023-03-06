#!/usr/bin/env python3
## usage: auto_create_wrapper.py <absolute_path/top_file.v>

import sys
top_file = sys.argv[1]

print("Path to top file:", top_file)

module_name = ""
module_ports = []

# parse top file line by line
file = open(top_file, "r")

get_ports = 0
for line in file:
    line = line.strip()

    if (get_ports):
        port = line.strip("input | output").strip(",")
        print(port)
        if line.startswith(");"):
            break

    if line.startswith("module"):
        module_name = line.strip("module").strip("(").strip()
        get_ports = 1


# print (module_name, module_ports)
