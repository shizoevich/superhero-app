import { useEffect, useState } from 'react';
import { Heading, Spinner, SimpleGrid, Box, Button, Flex } from '@chakra-ui/react';
import AddHeroModal from '../components/AddHeroModal';
import HeroCard from '../components/HeroCard';

export default function Home() {
  const [heroes, setHeroes] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const response = await fetch('/api/heroes');
        const data = await response.json();
        console.log('Response:', data);
        setHeroes(data.heroes);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHeroes();
  }, []);

  return (
    <Box p={5}>
      <Flex justify="space-between" align="center" mb={5}>
        <Button onClick={() => setShowModal(true)} colorScheme="teal">
          ➕ Add a hero
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={5}>
        {heroes.map(hero => (
          <HeroCard key={hero.id} hero={hero} />
        ))}
      </SimpleGrid>

      <AddHeroModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onHeroAdded={(newHero) => setHeroes(prev => [...prev, newHero])}
      />
    </Box>
  );
}
