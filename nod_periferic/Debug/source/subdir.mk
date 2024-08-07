################################################################################
# Automatically-generated file. Do not edit!
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS += \
../source/app_config.c \
../source/dht22.c \
../source/mtb.c \
../source/semihost_hardfault.c \
../source/wireless_uart.c 

C_DEPS += \
./source/app_config.d \
./source/dht22.d \
./source/mtb.d \
./source/semihost_hardfault.d \
./source/wireless_uart.d 

OBJS += \
./source/app_config.o \
./source/dht22.o \
./source/mtb.o \
./source/semihost_hardfault.o \
./source/wireless_uart.o 


# Each subdirectory must supply rules for building sources it contributes
source/%.o: ../source/%.c source/subdir.mk
	@echo 'Building file: $<'
	@echo 'Invoking: MCU C Compiler'
	arm-none-eabi-gcc -std=gnu99 -DCPU_MKW38A512VFT4 -DCPU_MKW38A512VFT4_cm0plus -DSDK_DEBUGCONSOLE=0 -DFRDM_KW38 -DCFG_BLE_PRJ=1 -DENABLE_RAM_VECTOR_TABLE=1 -DFSL_RTOS_FREE_RTOS -DCR_INTEGER_PRINTF -D__MCUXPRESSO -D__USE_CMSIS -DDEBUG -D__NEWLIB__ -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\source" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\amazon-freertos\freertos\portable" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\amazon-freertos\include" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\OSAbstraction\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\Flash" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\GPIO\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\Keyboard\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\Reset\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\Common" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\MemManager\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\Messaging\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\Panic\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\RNG\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\NVM\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\NVM\source" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\MWSCoexistence\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\SerialManager\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\SerialManager\source" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\TimersManager\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\TimersManager\source" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\ModuleInfo\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\FunctionLib\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\Lists\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\SecLib\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\source\common" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\bluetooth\host\config" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\bluetooth\host\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\bluetooth\controller\config" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\bluetooth\controller\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\source\common\gatt_db" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\source\common\gatt_db\macros" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\bluetooth\profiles\wireless_uart" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\bluetooth\profiles\battery" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\drivers" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\device" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\DCDC\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\XCVR\MKW38Z4" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\XCVR\MKW38Z4\nb2p4ghz\configs" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\XCVR\MKW38Z4\nb2p4ghz" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\CMSIS" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\board" -Og -fno-common -g3 -Wall -c  -ffunction-sections  -fdata-sections  -ffreestanding  -fno-builtin -imacros "app_preinclude.h" -fmacro-prefix-map="$(<D)/"= -mcpu=cortex-m0plus -mthumb -D__NEWLIB__ -fstack-usage -specs=nano.specs -MMD -MP -MF"$(@:%.o=%.d)" -MT"$(@:%.o=%.o)" -MT"$(@:%.o=%.d)" -o "$@" "$<"
	@echo 'Finished building: $<'
	@echo ' '


clean: clean-source

clean-source:
	-$(RM) ./source/app_config.d ./source/app_config.o ./source/dht22.d ./source/dht22.o ./source/mtb.d ./source/mtb.o ./source/semihost_hardfault.d ./source/semihost_hardfault.o ./source/wireless_uart.d ./source/wireless_uart.o

.PHONY: clean-source

