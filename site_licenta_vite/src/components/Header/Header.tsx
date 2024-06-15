import { Title, Burger, Group, useMantineColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './Header.module.css';

export function Header() {
  const [opened, { toggle }] = useDisclosure();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  return (
    <> 
    <Group bg={dark ? '#373A40' : '#099cff'} style={{ borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px' }}>
      <Title className={classes.title} ta="left" mt={5}> {/* margin-top */}
       Sistem wireless de monitorizare și control al terariilor
      </Title>
    </Group>
    </>
  );
}
