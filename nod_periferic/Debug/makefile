################################################################################
# Automatically-generated file. Do not edit!
################################################################################

-include ../makefile.init

RM := rm -rf

# All of the sources participating in the build are defined here
-include sources.mk
-include startup/subdir.mk
-include source/common/gatt_db/subdir.mk
-include source/common/subdir.mk
-include source/subdir.mk
-include framework/XCVR/MKW38Z4/nb2p4ghz/configs/subdir.mk
-include framework/XCVR/MKW38Z4/nb2p4ghz/subdir.mk
-include framework/XCVR/MKW38Z4/subdir.mk
-include framework/TimersManager/source/subdir.mk
-include framework/SerialManager/source/subdir.mk
-include framework/SecLib/source/subdir.mk
-include framework/Reset/source/subdir.mk
-include framework/RNG/source/subdir.mk
-include framework/Panic/source/subdir.mk
-include framework/OSAbstraction/source/subdir.mk
-include framework/NVM/source/subdir.mk
-include framework/ModuleInfo/source/subdir.mk
-include framework/Messaging/source/subdir.mk
-include framework/MemManager/source/subdir.mk
-include framework/MWSCoexistence/source/subdir.mk
-include framework/Lists/source/subdir.mk
-include framework/Keyboard/source/subdir.mk
-include framework/GPIO/source/subdir.mk
-include framework/FunctionLib/source/subdir.mk
-include framework/Flash/subdir.mk
-include framework/DCDC/source/subdir.mk
-include drivers/subdir.mk
-include device/subdir.mk
-include board/subdir.mk
-include bluetooth/profiles/wireless_uart/subdir.mk
-include bluetooth/profiles/battery/subdir.mk
-include bluetooth/host/config/subdir.mk
-include bluetooth/controller/task/subdir.mk
-include bluetooth/controller/interface/subdir.mk
-include bluetooth/controller/config/subdir.mk
-include amazon-freertos/freertos/portable/subdir.mk
-include amazon-freertos/freertos/subdir.mk
ifneq ($(MAKECMDGOALS),clean)
ifneq ($(strip $(C_DEPS)),)
-include $(C_DEPS)
endif
endif

-include ../makefile.defs

OPTIONAL_TOOL_DEPS := \
$(wildcard ../makefile.defs) \
$(wildcard ../makefile.init) \
$(wildcard ../makefile.targets) \


BUILD_ARTIFACT_NAME := licenta_wireless_uart_freertos
BUILD_ARTIFACT_EXTENSION := axf
BUILD_ARTIFACT_PREFIX :=
BUILD_ARTIFACT := $(BUILD_ARTIFACT_PREFIX)$(BUILD_ARTIFACT_NAME)$(if $(BUILD_ARTIFACT_EXTENSION),.$(BUILD_ARTIFACT_EXTENSION),)

# Add inputs and outputs from these tool invocations to the build variables 

# All Target
all:
	+@$(MAKE) --no-print-directory main-build && $(MAKE) --no-print-directory post-build

# Main-build Target
main-build: licenta_wireless_uart_freertos.axf

# Tool invocations
licenta_wireless_uart_freertos.axf: $(OBJS) $(USER_OBJS) makefile $(OPTIONAL_TOOL_DEPS)
	@echo 'Building target: $@'
	@echo 'Invoking: MCU Linker'
	arm-none-eabi-gcc -L"D:\Licenta\licenta\KW38\licenta_wireless_uart_freertos\libs" -Xlinker --sort-section=alignment -Xlinker --defsym=__ram_vector_table__=1 -Xlinker --defsym=gUseNVMLink_d=1 -Xlinker --gc-sections -Xlinker -print-memory-usage -Xlinker -Map="licenta_wireless_uart_freertos.map" -Xlinker --cref -mcpu=cortex-m0plus -mthumb -T licenta_wireless_uart_freertos_Debug.ld -o "licenta_wireless_uart_freertos.axf" $(OBJS) $(USER_OBJS) $(LIBS) -lm -lc -lgcc -lnosys -l_crypto_m0 -l_ble_kw38a4_controller_gcc -l_ble_5-0_host_cm0p_gcc
	@echo 'Finished building target: $@'
	@echo ' '

# Other Targets
clean:
	-$(RM) licenta_wireless_uart_freertos.axf
	-@echo ' '

post-build:
	-@echo 'Performing post-build steps'
	-arm-none-eabi-size "licenta_wireless_uart_freertos.axf"; # arm-none-eabi-objcopy -v -O binary "licenta_wireless_uart_freertos.axf" "licenta_wireless_uart_freertos.bin" ; # checksum -p MKW38A512xxx4 -d "licenta_wireless_uart_freertos.bin";
	-@echo ' '

.PHONY: all clean dependents main-build post-build

-include ../makefile.targets
