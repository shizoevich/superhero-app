import {
  Box, Button, Flex, Heading, IconButton, Image,
  Stack, Text, useDisclosure, SimpleGrid
} from '@chakra-ui/react';
import { ArrowBackIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { StarIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import EditHeroModal from '../components/EditHeroModal';
import DeleteHeroModal from '../components/DeleteHeroModal';

export default function HeroDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hero, setHero] = useState(null);
  const [formData, setFormData] = useState({
    nickname: '',
    real_name: '',
    origin_description: '',
    superpowers: '',
    catch_phrase: ''
  });
  const [newImages, setNewImages] = useState([]);

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose
  } = useDisclosure();

  const handleSetMain = (imageId) => {
  axios.put(`/api/heroes/images/${imageId}/set-main`)
    .then(() => axios.get(`/api/heroes/${id}`))
    .then(res => setHero(res.data))
    .catch(err => console.error(err));
};

const handleImageDelete = (imageId) => {
  axios.delete(`/api/heroes/images/${imageId}`)
    .then(() => axios.get(`/api/heroes/${id}`))
    .then(res => setHero(res.data))
    .catch(err => console.error(err));
};


  useEffect(() => {
    axios.get(`/api/heroes/${id}`)
      .then(res => {
        setHero(res.data);
        setFormData({
          nickname: res.data.nickname,
          real_name: res.data.real_name,
          origin_description: res.data.origin_description,
          superpowers: res.data.superpowers,
          catch_phrase: res.data.catch_phrase
        });
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setNewImages([...newImages, ...Array.from(e.target.files)]);
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    newImages.forEach((file) => data.append('images', file));

    axios.put(`/api/heroes/${id}`, data)
      .then(() => {
        onEditClose();
        setNewImages([]);
        return axios.get(`/api/heroes/${id}`);
      })
      .then(res => {
        setHero(res.data);
      })
      .catch(err => console.error(err));
  };

  const handleDelete = () => {
    axios.delete(`/api/heroes/${id}`)
      .then(() => {
        onDeleteClose();
        navigate('/');
      })
      .catch(err => console.error(err));
  };

  if (!hero) return <Text>Loading...</Text>;

  return (
    <Box p={4}>
      <Button
        leftIcon={<ArrowBackIcon />}
        mb={4}
        onClick={() => navigate(-1)}
        variant="outline"
      >
        Back
      </Button>

      <Flex justify="space-between" align="center" mb={4}>
        <Heading>{hero.nickname}</Heading>
        <Flex gap={2}>
          <IconButton
            icon={<EditIcon />}
            onClick={onEditOpen}
            aria-label="Edit"
          />
          <IconButton
            icon={<DeleteIcon />}
            onClick={onDeleteOpen}
            colorScheme="red"
            aria-label="Delete"
          />
        </Flex>
      </Flex>

      
<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
  {hero.images.map((img, index) => {
    const imageUrl = typeof img === 'string' ? img : img.image_url;
    const imageId = typeof img === 'object' ? img.id : null;
    const isMain = typeof img === 'object' && img.isMain;

    return (
      <Box key={index} position="relative" borderRadius="md" overflow="hidden">
        <Image
          src={imageUrl}
          alt={`Hero ${index}`}
          objectFit="cover"
          w="100%"
          h="300px"
          border={isMain ? '4px solid teal' : 'none'}
        />

        {imageId && (
          <Flex
            position="absolute"
            top="2"
            right="2"
            direction="column"
            gap={2}
            align="flex-end"
          >
            {isMain ? (
              <Flex
                align="center"
                gap={1}
                bg="yellow.400"
                color="black"
                px={2}
                py={1}
                borderRadius="md"
                fontWeight="bold"
              >
                <StarIcon />
                Main
              </Flex>
            ) : (
              <IconButton
                icon={<StarIcon />}
                size="sm"
                aria-label="Set as main"
                onClick={() => handleSetMain(imageId)}
                colorScheme="whiteAlpha"
                bg="blackAlpha.600"
                _hover={{ bg: 'blackAlpha.700' }}
              />
            )}
            <IconButton
              icon={<DeleteIcon />}
              size="sm"
              aria-label="Delete image"
              colorScheme="red"
              onClick={() => handleImageDelete(imageId)}
            />
          </Flex>
        )}
      </Box>
    );
  })}
</SimpleGrid>

      <Stack spacing={3} mt={6}>
        <Text><strong>Real Name:</strong> {hero.real_name}</Text>
        <Text><strong>Origin:</strong> {hero.origin_description}</Text>
        <Text><strong>Superpowers:</strong> {hero.superpowers}</Text>
        <Text><strong>Catch Phrase:</strong> "{hero.catch_phrase}"</Text>
      </Stack>

      <EditHeroModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        onSubmit={handleSubmit}
        formData={formData}
        onChange={handleChange}
        newImages={newImages}
        onFileChange={handleFileChange}
        onRemoveNewImage={removeNewImage}
      />

      <DeleteHeroModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onDelete={handleDelete}
        nickname={hero.nickname}
      />
    </Box>
  );
}
