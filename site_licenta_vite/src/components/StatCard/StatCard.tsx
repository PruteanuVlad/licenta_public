/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable eqeqeq */
// @ts-nocheck
import axios from 'axios';
import { useState, useEffect, SetStateAction } from 'react';
import { Text, rem, Switch, TextInput, useMantineColorScheme, Flex } from '@mantine/core';
import classes from './StatCard.module.css';

export function StatCard({ stat, id_node, nodeType }) {
    const { colorScheme } = useMantineColorScheme();

    const [upper_lim, setUpperLim] = useState(null);
    const [lower_lim, setLoweLim] = useState(null);
    const [isCheckedLight, setIsCheckedLight] = useState(true);
    const [isCheckedTemp, setIsCheckedTemp] = useState(true);
    const dark = colorScheme === 'dark';
    useEffect(() => {
      document.documentElement.style.setProperty('--paper-bg-color', dark ? '#495057' : '#ffffff');
      document.documentElement.style.setProperty('--main-bg-color', dark ? '#373A40' : '#099cff');
    }, [dark]);

    const postLimits = async (type, val) => {
        try {
            const response = await axios.post('https://site-licenta-10aff3814de1.herokuapp.com/add_limit', {
                nodeId: id_node,
                prop: stat.db,
                type,
                val,
            });
        } catch (error) { /* empty */ }
    };

    const pollControl = async () => {
      try {
        const response = await axios.get(`https://site-licenta-10aff3814de1.herokuapp.com/control?nodeId=${id_node}`);
        setIsCheckedLight(response.data.control_lumina[0]);
        setIsCheckedTemp(response.data.control_temp[0]);
      } catch (error) {
        console.error('Error fetching data from API 1:', error);
      }
    };

    useEffect(() => {
      pollControl();
    }, []);

    const [value, setValue] = useState(0);
    const modifyValue = (amount: SetStateAction<number>) => {
      setValue(amount);
    };
    const modifyLimInf = (amount: SetStateAction<number>) => {
        postLimits('inf', amount);
      };
    const modifyLimSup = (amount: SetStateAction<number>) => {
        postLimits('sup', amount);
    };
    const [indiceCategorie, setIndiceCategorie] = useState(0);
    const modifyIndiceCategorie = (amount: number) => {
      if (indiceCategorie + amount >= 0 && indiceCategorie + amount < categorii.length) {
        setIndiceCategorie(indiceCategorie + amount);
      }
    };
    const [perioadaTimp, setPerioadaTimp] = useState(0);

    const rightSideCelsius = (
      <div style={{ textAlign: 'right', fontSize: '18px' }}>
        <p>°C</p>
      </div>
    );

    const handleChangeLight = (event) => {
      setIsCheckedLight(event.currentTarget.checked);
      const sendPostRequest = async () => {
        try {
          const response = await axios.post('https://site-licenta-10aff3814de1.herokuapp.com/control', {
              nodeId: id_node,
              temp: isCheckedTemp ? 0 : 1,
              light: isCheckedLight ? 0 : 1,
          });
      } catch (error) { /* empty */ }
      };

      sendPostRequest();
    };

    const handleChangeTemp = (event) => {
      setIsCheckedTemp(event.currentTarget.checked);
      const sendPostRequest = async () => {
        try {
          const response = await axios.post('https://site-licenta-10aff3814de1.herokuapp.com/control', {
              nodeId: id_node,
              temp: isCheckedTemp ? 0 : 1,
              light: isCheckedLight ? 0 : 1,
          });
      } catch (error) { /* empty */ }
      };

      sendPostRequest();
    };

    return (
    <>
        <div className={classes.statStyle}>
            <Flex
              mih={50}
              gap="md"
              justify="center"
              align=" center"
              direction="row"
              wrap="wrap"
            >
                <div>
                <stat.icon
                  style={{ width: rem(32), height: rem(32) }}
                  className={classes.icon}
                  stroke={1.5}
                />
                    <Text className={classes.label}>{stat.label}</Text>
                    {((nodeType != 2) || (stat.label == 'Baterie')) && (
                    <Text className={classes.count}>
                    <span className={classes.value}>{stat.value + stat.sufix}</span>
                    </Text>)}
                    {(stat.label == 'Temp.' && nodeType > 1) && (
                    <Switch
                      checked={isCheckedTemp}
                      onChange={handleChangeTemp}
                    />
                    )}
                    {(stat.label == 'Lumină' && nodeType > 1) && (
                    <Switch
                      checked={isCheckedLight}
                      onChange={handleChangeLight}
                    />
                    )}
                </div>
                {((nodeType != 2) || (stat.label == 'Baterie')) && (
                <div>
                    {(stat.label != 'Ușă') && (
                    <TextInput
                      value={lower_lim}
                      onChange={(event) => modifyLimInf(parseInt(event.currentTarget.value, 10))}
                      style={{ width: '70px' }}
                      type="number"
                      placeholder={stat.lower_lim}
                      styles={(theme) => ({
                        label: {
                            whiteSpace: 'nowrap',
                        },
                        })}
                      label="Lim. inf."
                      rightSection={stat.sufix}
                      rightSectionWidth={30}
                    />
                    )}
                    {(stat.label != 'Ușă') && (
                    <TextInput
                      value={upper_lim}
                      onChange={(event) => modifyLimSup(parseInt(event.currentTarget.value, 10))}
                      style={{ width: '70px' }}
                      type="number"
                      placeholder={stat.upper_lim}
                      styles={(theme) => ({
                        label: {
                            whiteSpace: 'nowrap',
                        },
                        })}
                      label="Lim. sup."
                      rightSection={stat.sufix}
                      rightSectionWidth={30}
                    />
                    )}
                </div>)}
            </Flex>
        </div>
    </>
    );
}

export default StatCard;
