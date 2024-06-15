/* eslint-disable import/extensions */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Group, Space, Button, rem, useMantineColorScheme } from '@mantine/core';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Header } from '@/components/Header/Header';
import { NodeCard } from '@/components/NodeCard/NodeCard';
import { AddNode } from '@/components/AddNode/AddNode';
import classes from './Home.module.css';

const socket = new WebSocket('wss://site-licenta-10aff3814de1.herokuapp.com');

socket.onmessage = function (event) {
  const message = event.data;
  if (message === 'UPDATE') {
    // If message is "UPDATE", refresh the website
    window.location.reload();
  }
};

export function HomePage() {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const style = {
      backgroundColor: dark ? '#5c5f66' : '#099cff',
    };
  const [opened, { open, close }] = useDisclosure(false);
  const [noduri, setNoduri] = useState(null);
  const [tip, setTip] = useState(null);
  useEffect(() => {
    // Obtinerea id-urilor nodurilor
    const fetchNoduri = async () => {
      try {
        const response = await axios.get('https://site-licenta-10aff3814de1.herokuapp.com/noduri');
        setNoduri(response.data.id_nod);
        setTip(response.data.tip_nod);
        console.log(noduri);
        console.log(tip);
      } catch (error) { /* empty */ }
    };
    fetchNoduri();
  }, []);
  return (
    <>
      <Header />
      <Space h="lg" />
      {noduri && tip ? (
      Object.values(noduri).map((nodeId, index) => (
        <NodeCard nodeId={nodeId} nodeType={tip[index]} />
      ))
      ) : (
        <p>Loading...</p>
      )}

      <Modal opened={opened} onClose={close} title="Adaugă nod" centered>
        <AddNode />
      </Modal>
      <Group justify="center" mt="xl">
        <Button
          onClick={open}
          size="compact-xl"
          style={style}
          rightSection={
            <IconPlus
              style={{ width: rem(40), height: rem(40) }}
              className={classes.controlIcon}
              stroke={1.8}
            />}
        >
        Adaugă nod
        </Button>
      </Group>
      <ColorSchemeToggle />
    </>
  );
}
