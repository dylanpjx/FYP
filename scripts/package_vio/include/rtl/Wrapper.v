/*
  Template wrapper file for NUS labs:
  Might need some slight modifications based on top file
 */

module Wrapper(
  input clk,
  input RX, 
  output [15:0] led,
  output dp,
  output [7:0] anode, // anode for basys only has 4 to use
  output [6:0] cathode
);

wire btnL, btnD, btnU, btnR, btnC;
wire [15:0] SW;

vio_0
vio_inst (
  .clk(clk),
  .probe_in0(cathode),
  .probe_in1(anode),
  .probe_in2(dp),
  .probe_in3(led),

  .probe_out0(btnL),
  .probe_out1(btnD),
  .probe_out2(btnU),
  .probe_out3(btnR),
  .probe_out4(btnC),
  .probe_out5(SW)
);

top
top_inst (
  .clk(clk),

  .btnL(btnL),
  .btnD(btnD),
  .btnU(btnU),
  .btnR(btnR),
  .btnC(btnC),
  .SW(SW),
  .RX(RX),

  .cathode(cathode),
  .anode(anode),
  .dp(dp),
  .led(led)
);

endmodule
