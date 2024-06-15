################################################################################
# Automatically-generated file. Do not edit!
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS += \
../framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_coding_config.c \
../framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_common_config.c \
../framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_gfsk_bt_0p5_h_0p32_config.c \
../framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_gfsk_bt_0p5_h_0p5_config.c \
../framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_gfsk_bt_0p5_h_0p7_config.c \
../framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_gfsk_bt_0p5_h_1p0_config.c \
../framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_mode_config.c \
../framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_msk_config.c 

C_DEPS += \
./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_coding_config.d \
./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_common_config.d \
./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_gfsk_bt_0p5_h_0p32_config.d \
./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_gfsk_bt_0p5_h_0p5_config.d \
./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_gfsk_bt_0p5_h_0p7_config.d \
./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_gfsk_bt_0p5_h_1p0_config.d \
./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_mode_config.d \
./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_msk_config.d 

OBJS += \
./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_coding_config.o \
./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_common_config.o \
./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_gfsk_bt_0p5_h_0p32_config.o \
./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_gfsk_bt_0p5_h_0p5_config.o \
./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_gfsk_bt_0p5_h_0p7_config.o \
./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_gfsk_bt_0p5_h_1p0_config.o \
./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_mode_config.o \
./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_msk_config.o 


# Each subdirectory must supply rules for building sources it contributes
framework/XCVR/MKW38Z4/nb2p4ghz/configs/%.o: ../framework/XCVR/MKW38Z4/nb2p4ghz/configs/%.c framework/XCVR/MKW38Z4/nb2p4ghz/configs/subdir.mk
	@echo 'Building file: $<'
	@echo 'Invoking: MCU C Compiler'
	arm-none-eabi-gcc -std=gnu99 -DCPU_MKW38A512VFT4 -DCPU_MKW38A512VFT4_cm0plus -DSDK_DEBUGCONSOLE=0 -DFRDM_KW38 -DCFG_BLE_PRJ=1 -DENABLE_RAM_VECTOR_TABLE=1 -DFSL_RTOS_FREE_RTOS -DCR_INTEGER_PRINTF -D__MCUXPRESSO -D__USE_CMSIS -DDEBUG -D__NEWLIB__ -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\source" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\amazon-freertos\freertos\portable" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\amazon-freertos\include" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\OSAbstraction\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\Flash" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\GPIO\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\Keyboard\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\Reset\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\Common" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\MemManager\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\Messaging\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\Panic\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\RNG\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\NVM\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\NVM\source" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\MWSCoexistence\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\SerialManager\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\SerialManager\source" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\TimersManager\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\TimersManager\source" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\ModuleInfo\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\FunctionLib\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\Lists\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\SecLib\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\source\common" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\bluetooth\host\config" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\bluetooth\host\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\bluetooth\controller\config" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\bluetooth\controller\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\source\common\gatt_db" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\source\common\gatt_db\macros" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\bluetooth\profiles\wireless_uart" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\bluetooth\profiles\battery" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\drivers" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\device" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\DCDC\interface" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\XCVR\MKW38Z4" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\XCVR\MKW38Z4\nb2p4ghz\configs" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\framework\XCVR\MKW38Z4\nb2p4ghz" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\CMSIS" -I"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\board" -Og -fno-common -g3 -Wall -c  -ffunction-sections  -fdata-sections  -ffreestanding  -fno-builtin -imacros "app_preinclude.h" -fmacro-prefix-map="$(<D)/"= -mcpu=cortex-m0plus -mthumb -D__NEWLIB__ -fstack-usage -specs=nano.specs -MMD -MP -MF"$(@:%.o=%.d)" -MT"$(@:%.o=%.o)" -MT"$(@:%.o=%.d)" -o "$@" "$<"
	@echo 'Finished building: $<'
	@echo ' '


clean: clean-framework-2f-XCVR-2f-MKW38Z4-2f-nb2p4ghz-2f-configs

clean-framework-2f-XCVR-2f-MKW38Z4-2f-nb2p4ghz-2f-configs:
	-$(RM) ./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_coding_config.d ./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_coding_config.o ./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_common_config.d ./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_common_config.o ./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_gfsk_bt_0p5_h_0p32_config.d ./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_gfsk_bt_0p5_h_0p32_config.o ./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_gfsk_bt_0p5_h_0p5_config.d ./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_gfsk_bt_0p5_h_0p5_config.o ./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_gfsk_bt_0p5_h_0p7_config.d ./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_gfsk_bt_0p5_h_0p7_config.o ./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_gfsk_bt_0p5_h_1p0_config.d ./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_gfsk_bt_0p5_h_1p0_config.o ./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_mode_config.d ./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_mode_config.o ./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_msk_config.d ./framework/XCVR/MKW38Z4/nb2p4ghz/configs/nxp_xcvr_msk_config.o

.PHONY: clean-framework-2f-XCVR-2f-MKW38Z4-2f-nb2p4ghz-2f-configs
