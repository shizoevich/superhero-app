import { Box, Image, Text, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const HeroCard = ({ hero }) => {
  const imageUrl = hero.images?.[0]?.image_url || 'https://i.imgflip.com/lkla5.jpg?a485304';

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      width="100%"
    >
      <Box
        position="relative"
        width="100%"
        paddingTop="100%"
        borderRadius="md"
        overflow="hidden"
        mb={3}
      >
        <Image
          src={imageUrl}
          alt={hero.nickname}
          objectFit="cover"
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
        />
      </Box>

      <Text fontSize="xl" fontWeight="bold">{hero.nickname}</Text>
      <Link to={`/${hero.id}`}>
        <Button mt={2} colorScheme="teal" size="sm">
          View Profile
        </Button>
      </Link>
    </Box>
  );
};

export default HeroCard;
