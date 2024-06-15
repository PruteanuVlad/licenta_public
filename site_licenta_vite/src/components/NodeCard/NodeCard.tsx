/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable eqeqeq */
// @ts-nocheck
import { useState, useEffect, SetStateAction } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Text, Group, Space, UnstyledButton, Paper, rem, Grid, Switch, TextInput, useMantineColorScheme, Flex, SimpleGrid, Skeleton } from '@mantine/core';
import 'date-fns';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import {
  IconMist,
  IconSun,
  IconTemperature,
  IconChevronRight,
  IconChevronLeft,
  IconDropletHalf2Filled,
  IconLock,
  IconBattery2,
} from '@tabler/icons-react';
import classes from './NodeCard.module.css';
import { StatCard } from '@/components/StatCard/StatCard';

export function NodeCard({ nodeId, nodeType}) {
    const [temperatura, setTemperatura] = useState(false);
    const [umiditate, setUmiditate] = useState(false);
    const [baterie, setBaterie] = useState(false);
    const [lumina, setLumina] = useState(false);
    const [nivel_apa, setApa] = useState(false);
    const [usa, setUsa] = useState('Deschisă');
    const [temp_inf, setTempInf] = useState(0);
    const [temp_sup, setTempSup] = useState(0);
    const [umiditate_inf, setUmiditateInf] = useState(0);
    const [umiditate_sup, setUmiditateSup] = useState(0);
    const [apa_inf, setApaInf] = useState(0);
    const [apa_sup, setApaSup] = useState(0);
    const [lumina_inf, setLuminaInf] = useState(0);
    const [lumina_sup, setLuminaSup] = useState(0);
    const [baterie_inf, setBaterieInf] = useState(0);
    const [baterie_sup, setBaterieSup] = useState(0);
    const [xValues_n, setXValues_n] = useState(false);
    const [yValues_n, setYValues_n] = useState(false);
    const { colorScheme } = useMantineColorScheme();
    const [noduri, setNoduri] = useState(null);
    useEffect(() => {
      // Obtinerea id-urilor nodurilor
      const fetchNoduri = async () => {
        try {
          const response = await axios.get('https://site-licenta-10aff3814de1.herokuapp.com/noduri');
          setNoduri(response.data.id_nod);
        } catch (error) { /* empty */ }
      };
      fetchNoduri();
    }, []);

    const dark = colorScheme === 'dark';
    useEffect(() => {
      document.documentElement.style.setProperty('--paper-bg-color', dark ? '#495057' : '#ffffff');
      document.documentElement.style.setProperty('--main-bg-color', dark ? '#373A40' : '#099cff');
    }, [dark]);

    ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend,
      zoomPlugin,
      TimeScale,
    );
    const options = {
      responsive: true,
      scales: {
        x: {
          ticks: {
            stepSize: 2,
            autoSkip: true,
            maxRotation: 0,
            minRotation: 0,
          },
        },
      },
      elements: {
        point: {
            radius: 0,
        },
      },
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
        },
        zoom: {
          pan: {
            enabled: true,
            mode: 'x',
          },
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: 'x',
          },
        },
      },
    };
    const test = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    const labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const data = [
      { icon: IconTemperature, label: 'Temp.', value: temperatura, sufix: '°C', db: 'temp', upper_lim: temp_sup, lower_lim: temp_inf },
      { icon: IconSun, label: 'Lumină', value: lumina, sufix: ' lx', db: 'lumina', upper_lim: lumina_sup, lower_lim: lumina_inf },
      { icon: IconMist, label: 'Umiditate', value: umiditate, sufix: '%', db: 'umid', upper_lim: umiditate_sup, lower_lim: umiditate_inf },
      { icon: IconDropletHalf2Filled, label: 'Apă', value: nivel_apa, sufix: '%', db: 'apa', upper_lim: apa_sup, lower_lim: apa_inf },
      { icon: IconBattery2, label: 'Baterie', value: baterie, sufix: '%', db: 'bat', upper_lim: baterie_sup, lower_lim: baterie_inf },
      { icon: IconLock, label: 'Ușă', value: usa, sufix: '' },
    ];

    const pollData = async () => {
      try {
        let response = await axios.get(`https://site-licenta-10aff3814de1.herokuapp.com/poll_data?meas=temperatura&time=current&nodeId=${nodeId}`);
        setTemperatura(response.data.values);
        response = await axios.get(`https://site-licenta-10aff3814de1.herokuapp.com/poll_limits?prop=temp&type=inf&nodeId=${nodeId}`);
        setTempInf(response.data.value);
        response = await axios.get(`https://site-licenta-10aff3814de1.herokuapp.com/poll_limits?prop=temp&type=sup&nodeId=${nodeId}`);
        setTempSup(response.data.value);
        console.log(nodeType);
        response = await axios.get(`https://site-licenta-10aff3814de1.herokuapp.com/poll_data?meas=umiditate&time=current&nodeId=${nodeId}`);
        setUmiditate(response.data.values);
        response = await axios.get(`https://site-licenta-10aff3814de1.herokuapp.com/poll_limits?prop=umid&type=inf&nodeId=${nodeId}`);
        setUmiditateInf(response.data.value);
        response = await axios.get(`https://site-licenta-10aff3814de1.herokuapp.com/poll_limits?prop=umid&type=sup&nodeId=${nodeId}`);
        setUmiditateSup(response.data.value);

        response = await axios.get(`https://site-licenta-10aff3814de1.herokuapp.com/poll_data?meas=baterie&time=current&nodeId=${nodeId}`);
        setBaterie(response.data.values);
        response = await axios.get(`https://site-licenta-10aff3814de1.herokuapp.com/poll_limits?prop=bat&type=inf&nodeId=${nodeId}`);
        setBaterieInf(response.data.value);
        response = await axios.get(`https://site-licenta-10aff3814de1.herokuapp.com/poll_limits?prop=bat&type=sup&nodeId=${nodeId}`);
        setBaterieSup(response.data.value);

        response = await axios.get(`https://site-licenta-10aff3814de1.herokuapp.com/poll_data?meas=iluminare&time=current&nodeId=${nodeId}`);
        setLumina(response.data.values);
        response = await axios.get(`https://site-licenta-10aff3814de1.herokuapp.com/poll_limits?prop=lumina&type=inf&nodeId=${nodeId}`);
        setLuminaInf(response.data.value);
        response = await axios.get(`https://site-licenta-10aff3814de1.herokuapp.com/poll_limits?prop=lumina&type=sup&nodeId=${nodeId}`);
        setLuminaSup(response.data.value);

        response = await axios.get(`https://site-licenta-10aff3814de1.herokuapp.com/poll_data?meas=nivel_apa&time=current&nodeId=${nodeId}`);
        setApa(response.data.values);
        response = await axios.get(`https://site-licenta-10aff3814de1.herokuapp.com/poll_limits?prop=apa&type=inf&nodeId=${nodeId}`);
        setApaInf(response.data.value);
        response = await axios.get(`https://site-licenta-10aff3814de1.herokuapp.com/poll_limits?prop=apa&type=sup&nodeId=${nodeId}`);
        setApaSup(response.data.value);

       // response = await axios.get(`https://site-licenta-10aff3814de1.herokuapp.com/poll_data?meas=usa&time=current&nodeId=${nodeId}`);
        //setUsa(response.data.values);
      } catch (error) {
        console.error('Error fetching data from API 1:', error);
      }
    };

    useEffect(() => {
      pollData(); // Initial fetch
      //const interval = setInterval(pollData, 60000); // Poll every 10 seconds

      //return () => clearInterval(interval); // Clean up the interval on component unmount
    }, []);

    const categorii = ['Temperatură', 'Umiditate', 'Nivel apa', 'Iluminare', 'Baterie'];
    const coloane_sql = ['temperatura', 'umiditate', 'nivel_apa', 'iluminare', 'baterie'];
    const [value, setValue] = useState(0);
    const modifyValue = (amount: SetStateAction<number>) => {
      setValue(amount);
    };
    const [indiceCategorie, setIndiceCategorie] = useState(0);
    const modifyIndiceCategorie = (amount: number) => {
      if (indiceCategorie + amount >= 0 && indiceCategorie + amount < categorii.length) {
        setIndiceCategorie(indiceCategorie + amount);
      }
    };
    const [perioadaTimp, setPerioadaTimp] = useState(0);
    const perioadeTimp = ['day', 'week', 'month', 'year'];
    const data1 = {
      labels: xValues_n,
      datasets: [
        {
          label: categorii[indiceCategorie],
          data: yValues_n,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    };
    const rightSideCelsius = (
      <div style={{ textAlign: 'right', fontSize: '18px' }}>
        <p>°C</p>
      </div>
    );
    useEffect(() => {
      // Fetch data from API 3
      const fetchData3 = async () => {
        try {
          const response = await axios.get(`https://site-licenta-10aff3814de1.herokuapp.com/poll_data?meas=${coloane_sql[indiceCategorie]}&time=${perioadeTimp[perioadaTimp]}&nodeId=${nodeId}`);
          setXValues_n(response.data.date);
          setYValues_n(response.data.values);
        } catch (error) {
          console.error('Error fetching data from API 2:', error);
        }
      };

      fetchData3();
    }, [perioadaTimp]);
    const stats = data.map((stat) => (
      <StatCard stat={stat} id_node={nodeId} nodeType={nodeType} />
    ));
    const PRIMARY_COL_HEIGHT = rem(300);
    const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;
    return (
      <>
        <div className={classes.card}>
        <div style={{ fontSize: '18px'}}>Nodul {nodeId}</div>
        <Grid cols={{ base: 1, xl: 2 }} spacing="md">
        {(nodeType != 2) && (
          <Grid.Col span={{ xl: 7 }}>
            <Group justify="space-between">
              <Group>
                <UnstyledButton
                  className={classes.control}
                  onClick={() => modifyIndiceCategorie(-1)}
                >
                  <IconChevronLeft
                    style={{ width: rem(16), height: rem(16) }}
                    className={classes.controlIcon}
                    stroke={1.5}
                  />
                </UnstyledButton>
                <Text>{categorii[indiceCategorie]}</Text>
                <UnstyledButton
                  className={classes.control}
                  onClick={() => modifyIndiceCategorie(1)}
                >
                  <IconChevronRight
                    style={{ width: rem(16), height: rem(16) }}
                    className={classes.controlIcon}
                    stroke={1.5}
                  />
                </UnstyledButton>
              </Group>
            </Group>
            <Group>
              <UnstyledButton
                className={classes.control}
                onClick={() => setPerioadaTimp(0)}
              >
                <Text>24H</Text>
              </UnstyledButton>
              <UnstyledButton
                className={classes.control}
                onClick={() => setPerioadaTimp(1)}
              >
                <Text>1W</Text>
              </UnstyledButton>
              <UnstyledButton
                className={classes.control}
                onClick={() => setPerioadaTimp(2)}
              >
                <Text>1M</Text>
              </UnstyledButton>
              <UnstyledButton
                className={classes.control}
                onClick={() => setPerioadaTimp(3)}
              >
                <Text>1Y</Text>
              </UnstyledButton>
            </Group>
            <Line options={options} data={data1} className={classes.graph} />
          </Grid.Col>)}
          <Grid.Col span={{ xl: 5 }}>
            <Grid gutter="md">
              <Grid.Col span={{ base: 6, xs: 4 }}>
                {stats[0]}
              </Grid.Col>
              <Grid.Col span={{ base: 6, xs: 4 }}>
                {stats[1]}
              </Grid.Col>
              {(nodeType != 2) && (
              <Grid.Col span={{ base: 6, xs: 4 }}>
                {stats[2]}
              </Grid.Col>)}
              {(nodeType != 2) &&(
              <Grid.Col span={{ base: 6, xs: 4 }}>
                {stats[3]}
              </Grid.Col>)}
              <Grid.Col span={{ base: 6, xs: 4 }}>
                {stats[4]}
              </Grid.Col>
              {(nodeType != 2) && (
              <Grid.Col span={{ base: 6, xs: 4 }}>
                {stats[5]}
              </Grid.Col>)}
            </Grid>
          </Grid.Col>
        </Grid>
        </div>
        <Space h="xl" />
      </>
    );
}

export default NodeCard;
