## vivado -mode batch -source init.tcl

open_project [glob "./*.xpr"]

# Create VIO IP
source ./include/ip/vio.tcl

# Add Wrapper.v to sources
import_files ./include/rtl/Wrapper.v

# Set Wrapper.v as top file
set_property top Wrapper [current_fileset]
update_compile_order -fileset sources_1
update_compile_order -fileset sim_1

# Disable input constraints
set_property is_enabled false [get_files *.xdc]

# Add clock constraints
import_files -fileset constrs_1 ./include/xdc/init.xdc
update_compile_order -fileset constrs_1

# Generate bitstream
reset_run synth_1
launch_runs synth_1
wait_on_run synth_1
set_property STEPS.PHYS_OPT_DESIGN.IS_ENABLED true [get_runs impl_1]
launch_runs impl_1 -to_step write_bitstream
wait_on_run impl_1
puts "Implementation done!"
