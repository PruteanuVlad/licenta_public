################################################################################
# Automatically-generated file. Do not edit!
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS += \
../board/board.c \
../board/clock_config.c \
../board/gpio_pins.c \
../board/hardware_init.c \
../board/pin_mux.c 

C_DEPS += \
./board/board.d \
./board/clock_config.d \
./board/gpio_pins.d \
./board/hardware_init.d \
./board/pin_mux.d 

OBJS += \
./board/board.o \
./board/clock_config.o \
./board/gpio_pins.o \
./board/hardware_init.o \
./board/pin_mux.o 


# Each subdirectory must supply rules for building sources it contributes
board/%.o: ../board/%.c board/subdir.mk
	@echo 'Building file: $<'
	@echo 'Invoking: MCU C Compiler'
	arm-none-eabi-gcc -std=gnu99 -DCPU_MKW38A512VFT4 -DCPU_MKW38A512VFT4_cm0plus -DSDK_DEBUGCONSOLE=0 -DFRDM_KW38 -DCFG_BLE_PRJ=1 -DENABLE_RAM_VECTOR_TABLE=1 -DFSL_RTOS_FREE_RTOS -DCR_INTEGER_PRINTF -D__MCUXPRESSO -D__USE_CMSIS -DDEBUG -D__NEWLIB__ -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\source" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\amazon-freertos\freertos\portable" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\amazon-freertos\include" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\OSAbstraction\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\Flash" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\GPIO\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\Keyboard\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\Reset\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\Common" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\MemManager\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\Messaging\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\Panic\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\RNG\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\NVM\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\NVM\source" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\MWSCoexistence\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\SerialManager\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\SerialManager\source" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\TimersManager\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\TimersManager\source" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\ModuleInfo\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\FunctionLib\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\Lists\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\SecLib\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\source\common" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\bluetooth\host\config" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\bluetooth\host\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\bluetooth\controller\config" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\bluetooth\controller\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\source\common\gatt_db" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\source\common\gatt_db\macros" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\bluetooth\profiles\wireless_uart" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\bluetooth\profiles\battery" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\drivers" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\device" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\DCDC\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\XCVR\MKW38Z4" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\XCVR\MKW38Z4\nb2p4ghz\configs" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\XCVR\MKW38Z4\nb2p4ghz" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\CMSIS" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\board" -Og -fno-common -g3 -Wall -c  -ffunction-sections  -fdata-sections  -ffreestanding  -fno-builtin -imacros "app_preinclude.h" -fmacro-prefix-map="$(<D)/"= -mcpu=cortex-m0plus -mthumb -D__NEWLIB__ -fstack-usage -specs=nano.specs -MMD -MP -MF"$(@:%.o=%.d)" -MT"$(@:%.o=%.o)" -MT"$(@:%.o=%.d)" -o "$@" "$<"
	@echo 'Finished building: $<'
	@echo ' '


clean: clean-board

clean-board:
	-$(RM) ./board/board.d ./board/board.o ./board/clock_config.d ./board/clock_config.o ./board/gpio_pins.d ./board/gpio_pins.o ./board/hardware_init.d ./board/hardware_init.o ./board/pin_mux.d ./board/pin_mux.o

.PHONY: clean-board

