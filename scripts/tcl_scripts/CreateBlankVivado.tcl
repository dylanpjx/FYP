#------------------------------------------------------------
# Copyright (c) 2016-2017 XJTAG Limited. All rights reserved.
#
# Redistribution and use in source and binary forms, with or without modification,
# are permitted provided that the source code retains the above copyright notice,
# this condition and the following disclaimer.
#
# The software is provided by XJTAG Ltd. "as is" and any express or implied warranties,
# including, but not limited to, the implied warranties of merchantability and fitness
# for a particular purpose are disclaimed. In no event shall XJTAG Ltd. be liable for
# any direct, indirect, incidental, special, exemplary, or consequential damages
# (including, but not limited to, procurement of substitute goods or services; loss of
# use, data, or profits; or business interruption) however caused and on any theory of
# liability, whether in contract, strict liability, or tort (including negligence or 
# otherwise) arising in any way out of the use of this software, even if advised of the
# possibility of such damage.
#
# If you find any problems with this file, please contact
# support@xjtag.com
#------------------------------------------------------------

if {[catch {current_project} result]} {
	puts "ERROR: A project must already be open to run this script";
	return;
}

set project_dir [get_property directory [current_project]]

# Remove all current files
remove_files [get_files]

# Create top level Verilog file
set fpga_top_filename [file join $project_dir {fpga_top.v}]

if [catch {set fp [open $fpga_top_filename w]} msg] {
  puts "Can't create $fpga_top_filename"
  puts $msg
  return
}

puts $fp {module fpga_top();}
puts $fp {wire link;}
puts $fp {BSCANE2 #(.JTAG_CHAIN(1))}
puts $fp {BSCANE2_inst (}
puts $fp {  .TDI(link),}
puts $fp {  .TDO(link)}
puts $fp {);}
puts $fp {endmodule}

close $fp

add_files $fpga_top_filename

# Create constaints file
set constraints_filename [file join $project_dir {fpga_top.xdc}]

if [catch {set fp [open $constraints_filename w]} msg] {
  puts "Can't create $constraints_filename"
  puts $msg
  return
}

puts $fp {set_property BITSTREAM.GENERAL.COMPRESS TRUE [current_design]}
puts $fp {set_property BITSTREAM.CONFIG.UNUSEDPIN PULLNONE [current_design]}

close $fp

add_files $constraints_filename

set_property top fpga_top [current_fileset]

reset_run [get_property parent [current_run]]
launch_runs [get_property parent [current_run]]
wait_on_run [get_property parent [current_run]]

launch_runs [current_run] -to_step write_bitstream
wait_on_run [current_run]

set bitfile [file join [get_property directory [current_run]] {fpga_top.bit}]
set svffile [file join $project_dir "blank_[get_property device [get_property part [current_project]]].svf"]

close_hw -quiet

open_hw

set old_hw_server [get_hw_servers -quiet]

if {[llength $old_hw_server] > 0} {
  puts "Disconnecting old hardware servers"
  disconnect_hw_server $old_hw_server
}

current_hw_server [connect_hw_server]

set old_target [get_hw_targets -quiet -regexp .*/create_blank_target]

if {[llength $old_target] > 0} {
  puts "Removing old target"
  delete_hw_target $old_target
}

current_hw_target [create_hw_target create_blank_target]
open_hw_target [current_hw_target]

set partDevice [get_property device [get_property part [current_project]]]

# Try to create the hardware device, handling the case for automotive/defense grade if they don't work
if [catch {set device0 [create_hw_device -part $partDevice]} msg] {
  puts "Error creating hw for device $partDevice: $msg"
  
  if [string equal -nocase [string range $partDevice 0 1] "xa"] {
    set partDevice [string replace $partDevice 0 1 "xc"]
    puts "Detected automotive part, attempting to use base part $partDevice instead..."
  } elseif [string equal -nocase [string range $partDevice 0 1] "xq"] {
    set partDevice [string replace $partDevice 0 1 "xc"]
    puts "Detected defense grade part, attempting to use base part $partDevice instead..."
  }

  # Allow an error to be generated if it fails second time
  set device0 [create_hw_device -part $partDevice]
}

if {[llength $device0] > 0} {
  set_property PROGRAM.FILE $bitfile $device0

  # Generate SVF file compatible with other devices in the JTAG chain
  set_param xicom.config_chunk_size 0

  program_hw_devices -force -svf_file $svffile $device0
}

close_hw_target
delete_hw_target [get_hw_targets -regexp .*/create_blank_target]

disconnect_hw_server -quiet
close_hw
