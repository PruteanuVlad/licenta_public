import axios from 'axios';
import { useState } from 'react';
import { Group, Select, Button, TextInput, useMantineColorScheme } from '@mantine/core';

export function AddNode() {
    const { colorScheme } = useMantineColorScheme();
    const [adresaNod, setAdresa] = useState('');
    const [pin, setPin] = useState('');
    const [tip, setTip] = useState<string | null>('');

    const addNode = async () => {
        try {
            const response = await axios.post('https://site-licenta-10aff3814de1.herokuapp.com/add_node', {
                adresa: adresaNod,
                pin,
                tip: tip?.split(' ')[0],
            });
        } catch (error) { /* empty */ }
    };
    return (
        <>
          <TextInput label="Adresă nod" value={adresaNod} onChange={(event) => setAdresa(event.currentTarget.value)} placeholder="FF:EE:42:AD:18:CB" />
          <TextInput label="PIN" value={pin} onChange={(event) => setPin(event.currentTarget.value)} placeholder="123456" />
          <Select
            label="Tip nod"
            placeholder="Selectează tipul nodului"
            data={['1 - Senzor', '2 - Control', '3 - Senzor și control']}
            value={tip}
            onChange={(setTip)}
          />
          <Group justify="center" mt="xl">
            <Button size="small" onClick={() => addNode()}>
                Adaugă nod
            </Button>
          </Group>
        </>
    );
}

export default AddNode;
