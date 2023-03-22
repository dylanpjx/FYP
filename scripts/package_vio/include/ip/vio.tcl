create_ip -name vio -vendor xilinx.com -library ip -module_name vio_0

set_property -dict {
  CONFIG.C_NUM_PROBE_OUT {6}
  CONFIG.C_PROBE_OUT0_WIDTH {1}
  CONFIG.C_PROBE_OUT1_WIDTH {1}
  CONFIG.C_PROBE_OUT2_WIDTH {1}
  CONFIG.C_PROBE_OUT3_WIDTH {1}
  CONFIG.C_PROBE_OUT4_WIDTH {1}
  CONFIG.C_PROBE_OUT5_WIDTH {16}

  CONFIG.C_NUM_PROBE_IN {4}
  CONFIG.C_PROBE_IN0_WIDTH {7}
  CONFIG.C_PROBE_IN1_WIDTH {8}
  CONFIG.C_PROBE_IN2_WIDTH {1}
  CONFIG.C_PROBE_IN3_WIDTH {16}
 } [get_ips vio_0]

generate_target {instantiation_template synthesis} [get_ips]
