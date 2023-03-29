`timescale 1ns / 1ps
//////////////////////////////////////////////////////////////////////////////////
// Company: 
// Engineer: 
// 
// Create Date: 10/16/2022 07:42:33 PM
// Design Name: 
// Module Name: top
// Project Name: 
// Target Devices: 
// Tool Versions: 
// Description: 
// 
// Dependencies: 
// 
// Revision:
// Revision 0.01 - File Created
// Additional Comments:
// 
//////////////////////////////////////////////////////////////////////////////////


module top(
  input clk, // 100MHz

  input btnL,
  input btnD,
  input btnU,
  input btnR,
  input btnC,
  input [15:0] SW,

  output [6:0] cathode,
  output [7:0] anode,
  output dp,
  output [15:0] led
  );

  wire [13:0] num;
  // start trail led if switches 1, 8, 10 are enabled
  led_trail
  led_trail_inst (
    .clk(clk),
    .SW(SW),
    .led(led)
  );

  // output num is controlled by buttons
  output_num_control
  output_num_control_inst (
    .clk(clk),

    .btnL(btnL),
    .btnD(btnD),
    .btnU(btnU),
    .btnR(btnR),
    .btnC(btnC),
    
    .num(num)
  );

  // show the number on the 7seg
  sevenseg
  sevenseg_inst (
  .clk(clk),
  .num(num),

  .cathode(cathode),
  .anode(anode),
  .dp(dp)
  );
endmodule
