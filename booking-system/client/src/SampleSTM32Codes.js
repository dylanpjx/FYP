const sampleGPIOInit = `static void MX_GPIO_Init(void)
{
  __HAL_RCC_GPIOB_CLK_ENABLE();	// Enable AHB2 Bus for GPIOB
  __HAL_RCC_GPIOC_CLK_ENABLE();	// Enable AHB2 Bus for GPIOC

  HAL_GPIO_WritePin(GPIOB, LED2_Pin, GPIO_PIN_RESET); // Reset the LED2_Pin as 0

  GPIO_InitTypeDef GPIO_InitStruct = {0};

  // Configuration of LED2_Pin (GPIO-B Pin-14) as GPIO output
  GPIO_InitStruct.Pin = LED2_Pin;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(GPIOB, &GPIO_InitStruct);
  
  // Configuration of PC5 (GPIO-C Pin-5) as AF
  GPIO_InitStruct.Pin = GPIO_PIN_5;
  GPIO_InitStruct.Mode = GPIO_MODE_IT_RISING;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);

  // Enable NVIC EXTI line 5
  HAL_NVIC_EnableIRQ(EXTI9_5_IRQn);  
}`;

const sampleGPIOCallback = `HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin)
{
  if(GPIO_Pin == GPIO_PIN_5){
    // We will toggle the LED output once virtual button (USER) is pressed
    HAL_GPIO_TogglePin(GPIOB, GPIO_PIN_14);
  }
}
`;

const sampleUARTInit = `static void UART1_Init(void)
{
    /* Pin configuration for UART. BSP_COM_Init() can do this automatically */
    __HAL_RCC_GPIOB_CLK_ENABLE();
    GPIO_InitTypeDef GPIO_InitStruct = {0};
    GPIO_InitStruct.Alternate = GPIO_AF7_USART1;
    GPIO_InitStruct.Pin = GPIO_PIN_7|GPIO_PIN_6;
    GPIO_InitStruct.Mode = GPIO_MODE_AF_PP;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_VERY_HIGH;
    HAL_GPIO_Init(GPIOB, &GPIO_InitStruct);

    /* Configuring UART1 */
    huart1.Instance = USART1;
    huart1.Init.BaudRate = 115200;
    huart1.Init.WordLength = UART_WORDLENGTH_8B;
    huart1.Init.StopBits = UART_STOPBITS_1;
    huart1.Init.Parity = UART_PARITY_NONE;
    huart1.Init.Mode = UART_MODE_TX_RX;
    huart1.Init.HwFlowCtl = UART_HWCONTROL_NONE;
    huart1.Init.OverSampling = UART_OVERSAMPLING_16;
    huart1.Init.OneBitSampling = UART_ONE_BIT_SAMPLE_DISABLE;
    huart1.AdvancedInit.AdvFeatureInit = UART_ADVFEATURE_NO_INIT;
    if (HAL_UART_Init(&huart1) != HAL_OK)
    {
      while(1);
    }

}`;

const sampleUARTCode = 
`#include "main.h"

extern void initialise_monitor_handles(void);
void SystemClock_Config(void); 

static void UART1_Init(void);
UART_HandleTypeDef huart1;

int main(void)
{
  initialise_monitor_handles();
  HAL_Init();
  MX_GPIO_Init();
  UART1_Init();
  int seconds_count = 0;  

  while (1)
  {
    seconds_count++;
    char msg[] = "STM32 Discovery board says Hi! \\r\\n";
    char msg_print[64];
    sprintf(msg_print, "%d s: %s",seconds_count, msg);
    HAL_UART_Transmit(&huart1, (uint8_t*)msg_print, strlen(msg_print), 0xFFFF);
    HAL_Delay(1000);
  }
}`;

const sampleUARTCodeSensor = 
`while (1)
{
  float xl_data[3];
  int16_t xl_data_i16[3] = { 0 };      // array to store the x, y and z readings.
  BSP_ACCELERO_AccGetXYZ(xl_data_i16); // read accelerometer
  // the function above returns 16 bit integers which are 100 * acceleration_in_m/s2. Converting to float to print the actual acceleration.
  xl_data[0] = (float)xl_data_i16[0] / 100.0f;
  xl_data[1] = (float)xl_data_i16[1] / 100.0f;
  xl_data[2] = (float)xl_data_i16[2] / 100.0f;

  char message_print[64];
  sprintf(message_print, "Acceleration: X:%f Y:%f Z:%f \\n \\r", xl_data[0],xl_data[1],xl_data[2]);
  HAL_UART_Transmit(&huart1, (uint8_t*)message_print, strlen(message_print),0xFFFF); //Sending in normal mode
}`;

const sampleI2CInit = `static void MX_I2C1_Init(void)
{

  hi2c1.Instance = I2C1;
  hi2c1.Init.Timing = 0x10909CEC;
  hi2c1.Init.OwnAddress1 = 0;
  hi2c1.Init.AddressingMode = I2C_ADDRESSINGMODE_7BIT;
  hi2c1.Init.DualAddressMode = I2C_DUALADDRESS_DISABLE;
  hi2c1.Init.OwnAddress2 = 0;
  hi2c1.Init.OwnAddress2Masks = I2C_OA2_NOMASK;
  hi2c1.Init.GeneralCallMode = I2C_GENERALCALL_DISABLE;
  hi2c1.Init.NoStretchMode = I2C_NOSTRETCH_DISABLE;
  if (HAL_I2C_Init(&hi2c1) != HAL_OK)
  {
    Error_Handler();
  }
  /** Configure Analogue filter
  */
  if (HAL_I2CEx_ConfigAnalogFilter(&hi2c1, I2C_ANALOGFILTER_ENABLE) != HAL_OK)
  {
    Error_Handler();
  }
  /** Configure Digital filter
  */
  if (HAL_I2CEx_ConfigDigitalFilter(&hi2c1, 0) != HAL_OK)
  {
    Error_Handler();
  }
}

void Error_Handler(void)
{
  /* USER CODE BEGIN Error_Handler_Debug */
  /* User can add his own implementation to report the HAL error return state */
  __disable_irq();
  while (1)
  {
  }
  /* USER CODE END Error_Handler_Debug */
}
`;

const sampleI2CPinsInit = 
`/**
* @brief I2C MSP Initialization
* This function configures the hardware resources used in this example
* @param hi2c: I2C handle pointer
* @retval None
*/
void HAL_I2C_MspInit(I2C_HandleTypeDef* hi2c)
{
  GPIO_InitTypeDef GPIO_InitStruct = {0};

  // I2C2 stuff...
  
  if(hi2c->Instance==I2C1)
  {
  /* USER CODE BEGIN I2C1_MspInit 0 */

  /* USER CODE END I2C1_MspInit 0 */

    __HAL_RCC_GPIOB_CLK_ENABLE();
    /**I2C1 GPIO Configuration
    PB8     ------> I2C1_SCL
    PB9     ------> I2C1_SDA
    */
    GPIO_InitStruct.Pin = GPIO_PIN_8|GPIO_PIN_9;
    GPIO_InitStruct.Mode = GPIO_MODE_AF_OD;
    GPIO_InitStruct.Pull = GPIO_PULLUP;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_VERY_HIGH;
    GPIO_InitStruct.Alternate = GPIO_AF4_I2C1;
    HAL_GPIO_Init(GPIOB, &GPIO_InitStruct);

    /* Peripheral clock enable */
    __HAL_RCC_I2C1_CLK_ENABLE();
  /* USER CODE BEGIN I2C1_MspInit 1 */

  /* USER CODE END I2C1_MspInit 1 */
  }

}

/**
* @brief I2C MSP De-Initialization
* This function freeze the hardware resources used in this example
* @param hi2c: I2C handle pointer
* @retval None
*/
void HAL_I2C_MspDeInit(I2C_HandleTypeDef* hi2c)
{
  // I2C2 stuff...

  if(hi2c->Instance==I2C1)
  {
  /* USER CODE BEGIN I2C1_MspDeInit 0 */

  /* USER CODE END I2C1_MspDeInit 0 */
    /* Peripheral clock disable */
    __HAL_RCC_I2C1_CLK_DISABLE();

    /**I2C1 GPIO Configuration
    PB8     ------> I2C1_SCL
    PB9     ------> I2C1_SDA
    */
    HAL_GPIO_DeInit(GPIOB, GPIO_PIN_8);
    HAL_GPIO_DeInit(GPIOB, GPIO_PIN_9);

  /* USER CODE BEGIN I2C1_MspDeInit 1 */

  /* USER CODE END I2C1_MspDeInit 1 */
  }
}


`;

const sampleI2CCode =  
`#define I2C_SLAVE_ADDR 0x20
#define OUT_X_L 0x21 

void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_USART1_UART_Init(void);
static void MX_I2C1_Init(void);

int main(void)
{
  HAL_Init();
  SystemClock_Config();

  /* Initialize all configured peripherals */
  MX_GPIO_Init();
  MX_USART1_UART_Init();
  MX_I2C1_Init();

  int seconds_count = 0;

  while (1)
  {
    char msg[72];
    static uint8_t buff[10];  
    seconds_count++;
    
    HAL_StatusTypeDef ret = HAL_I2C_IsDeviceReady(&hi2c1, (0x20 << 1), 3, 10);
    HAL_I2C_Mem_Read(&hi2c1, (0x20 << 1), 0x21, I2C_MEMADD_SIZE_8BIT, buff, 6, 200); // read 6 bytes starting from 0x20 (until 0x25)

    // Get the full X reading by doing ((int16_t)buff[1]<<8) + (int16_t)buff[0]. We can do this for Y and Z

    sprintf(msg,"%d s - Values: %d %d %d %d %d %d\\r\\n",seconds_count,buff[0],buff[1],buff[2],buff[3],buff[4],buff[5]);
    HAL_UART_Transmit(&huart1, (uint8_t*)msg, strlen(msg), HAL_MAX_DELAY);
    HAL_Delay(1000);
  }
}`;

export{
    sampleGPIOInit,
    sampleGPIOCallback,
    sampleUARTInit,
    sampleUARTCode,
    sampleUARTCodeSensor,
    sampleI2CInit,
    sampleI2CPinsInit,
    sampleI2CCode
}