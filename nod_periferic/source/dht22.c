#include "pin_mux.h"
#include "fsl_tpm.h"
#include "fsl_gpio.h"
#include "MKW38A4.h"
#include "GPIO_Adapter.h"
#include "DHT22.h"

gpioInputPinConfig_t pInputConfig;

volatile uint8_t delta = 0;
volatile int k = 0;

DHT22_Result dht22_error(uint8_t error_code){
	DHT22_Result error;

	error.error_code = error_code;

	return error;
}

void dht22_pin_isr(){
	/* Memoreaza durata de timp de la ultima intrerupere si pana la cea actuala. */
	delta = TPM0->CNT;
	GpioClearPinIntFlag(&pInputConfig);
}

void dht22_delay_us(uint16_t delay)
{
    tpm_config_t timer_config={0};
    TPM_GetDefaultConfig(&timer_config);

    /* Configureaza ceasul sa aiba o frecventa de 1MHz => 1us/tick */
    timer_config.prescale = kTPM_Prescale_Divide_32;
    TPM_Init(TPM0, &timer_config);

    TPM_StopTimer(TPM0);
    TPM0->CNT = 0;
    TPM_StartTimer(TPM0, kTPM_SystemClock);
    while(TPM0->CNT<delay);
    TPM_StopTimer(TPM0);

    TPM_ClearStatusFlags(TPM0, kTPM_TimeOverflowFlag);
}

uint8_t dht22_check_if_idle(){
	/*Configureaza pinul PTC3 sa detecteze frontul crescator sau descrescator al semnalului. */
	PTC3_InputInit();
	pInputConfig.gpioPin = 3;
	pInputConfig.gpioPort = gpioPort_C_c;
	pInputConfig.interruptSelect = pinInt_EitherEdge_c;
	pInputConfig.pullSelect = pinPull_Disabled_c;

	(void)GpioInstallIsr(dht22_pin_isr, 1, 1, &pInputConfig);
	delta = 0;
	dht22_delay_us(10000);
	GpioUninstallIsr(&pInputConfig);

    if(delta > 0){
    	return DHT22_NOT_IDLE;
    }

    return DHT22_OK;
}

DHT22_Result dht22_init(){
    gpio_pin_config_t PTC3_config = {
        .pinDirection = kGPIO_DigitalOutput,
        .outputLogic = 0U
    };

    NVIC_DisableIRQ(PORTB_PORTC_IRQn);
    GPIO_PinInit(PTC3_INPUTINIT_PTC3_GPIO, PTC3_INPUTINIT_PTC3_PIN, &PTC3_config);

    GPIO_PinWrite(GPIOC,3,0);
    dht22_delay_us(18000);
    GPIO_PinWrite(GPIOC,3,1);
    dht22_delay_us(20);

    PTC3_InputInit();

    return dht22_response();
}


DHT22_Result dht22_response(){
	NVIC_EnableIRQ(PORTB_PORTC_IRQn);
	(void)GpioInstallIsr( dht22_pin_isr, 1, 1, &pInputConfig);
	TPM_StopTimer(TPM0);
	TPM0->CNT = 0;
	delta = 0;
	GpioSetPinInterrupt(gpioPort_C_c, 3, pinInt_EitherEdge_c);
	TPM_StartTimer(TPM0, kTPM_SystemClock);

	while(delta == 0){
		if(TPM0->CNT > 100){
			return dht22_error(DHT22_TIMEOUT);
		}
	}

	if(!(delta >= 80 - 40 && delta <= 80 + 40)){
		return dht22_error(DHT22_BAD_TIMING);
	}

	TPM_StopTimer(TPM0);
	TPM0->CNT = 0;
	delta = 0;
	TPM_StartTimer(TPM0, kTPM_SystemClock);

	while(delta == 0){
		if(TPM0->CNT > 100){
			return dht22_error(DHT22_TIMEOUT);
		}
	}

	if(!(delta >= 80 - 20 && delta <= 80 + 20)){
		return dht22_error(DHT22_BAD_TIMING);
	}

	return dht22_read_data();
}

DHT22_Result dht22_read_data(){
	uint8_t data[5];
	uint8_t bytes_read = 0;
	uint8_t current_index = 0;

	for(int i = 0; i < 5; i++)
		data[i] = 0;

	while(bytes_read<5){
		TPM_StopTimer(TPM0);
		TPM0->CNT = 0;
		delta = 0;
		TPM_StartTimer(TPM0, kTPM_SystemClock);

		while(delta == 0){
			if(TPM0->CNT > 100){
				return dht22_error(DHT22_TIMEOUT);
			}
		}
		if(!(delta >= DHT22_BIT_PREFIX - 15 && delta <= DHT22_BIT_PREFIX + 15)){
			return dht22_error(DHT22_BAD_TIMING);
		}

		TPM_StopTimer(TPM0);
		TPM0->CNT = 0;
		delta = 0;
		TPM_StartTimer(TPM0, kTPM_SystemClock);

		while(delta == 0){
		    if(TPM0->CNT > 100){
		    	return dht22_error(DHT22_TIMEOUT);
		    }
		}
		if(delta > DHT22_BIT_0 - 10 && delta < DHT22_BIT_0 + 10){
			/* Bitul e 0 */
		}
		else if(delta > DHT22_BIT_1 - 10 && delta < DHT22_BIT_1 + 10){
			/* Bitul e 1 */
			data[bytes_read] = data[bytes_read] + (1 << (7 - current_index));
		}
		else{
			return dht22_error(DHT22_BAD_TIMING);
		}
		if(current_index == 7){
			current_index = 0;
			bytes_read++;
		}
		else
			current_index++;
	}

	return dht22_checksum(data);
}

DHT22_Result dht22_checksum(uint8_t *data){
	DHT22_Result result;

	if(((data[0]+data[1]+data[2]+data[3])&0xFF) != data[4])
		return dht22_error(DHT22_BAD_CHECKSUM);

	result.humidity = (data[0]<<8)+data[1];
	result.temperature = (data[2]<<8)+data[3];
	result.error_code = DHT22_OK;
	return result;
}
