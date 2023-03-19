open_hw_manager
connect_hw_server
open_hw_target

open_project [glob "./*.xpr"]
set_property PROGRAM.FILE [glob *.runs/impl*/Wrapper.bit] [get_hw_devices]
set_property PROBE.FILE [glob *.runs/impl*/Wrapper.ltx] [get_hw_devices]

program_hw_devices
refresh_hw_device

startGroup
    set_property OUTPUT_VALUE 1 [get_hw_probes btnU]
    commmit_hw_vio [get_hw_probes {btnU}]
endGroup

startGroup
    set_property OUTPUT_VALUE 0 [get_hw_probes btnU]
    commmit_hw_vio [get_hw_probes {btnU}]
endGroup
