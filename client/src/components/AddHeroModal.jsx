import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Button, FormControl, FormLabel, Input,
  Textarea, useToast, FormErrorMessage, Text
} from '@chakra-ui/react';
import { useState } from 'react';
import ImageUploader from './ImageUploader';

export default function AddHeroModal({ isOpen, onClose, onHeroAdded }) {
  const toast = useToast();

  const [formData, setFormData] = useState({
    nickname: '',
    real_name: '',
    origin_description: '',
    superpowers: '',
    catch_phrase: '',
    imageFile: null,
    imageUrl: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageUpload = (file) => {
    setFormData(prev => ({ ...prev, imageFile: file, imageUrl: '' }));
    setErrors(prev => ({ ...prev, image: '' }));
  };

  const handleImageUrlChange = (url) => {
    setFormData(prev => ({ ...prev, imageUrl: url, imageFile: null }));
    setErrors(prev => ({ ...prev, image: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['nickname', 'real_name', 'origin_description', 'superpowers', 'catch_phrase'];

    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    // Allow no image, but if provided, only one method is allowed
    if (formData.imageFile && formData.imageUrl) {
      newErrors.image = 'Please provide either a file or a URL, not both';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const form = new FormData();

      // Text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value && !['imageFile', 'imageUrl'].includes(key)) {
          form.append(key, value);
        }
      });

      // Only one image is allowed and it's the main image
      if (formData.imageFile) {
        form.append('main_image', formData.imageFile);
      } else if (formData.imageUrl) {
        form.append('main_image_url', formData.imageUrl);
      }

      const res = await fetch('/api/heroes', {
        method: 'POST',
        body: form
      });

      const data = await res.json();

      if (res.ok) {
        onHeroAdded(data.hero);
        toast({ title: 'Hero added!', status: 'success', duration: 2000 });
        onClose();
        setFormData({
          nickname: '',
          real_name: '',
          origin_description: '',
          superpowers: '',
          catch_phrase: '',
          imageFile: null,
          imageUrl: ''
        });
        setErrors({});
      } else {
        toast({ title: 'Error', description: data.message || 'Something went wrong.', status: 'error' });
      }
    } catch (err) {
      toast({ title: 'Server Error', description: err.message, status: 'error' });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Hero</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={3} isInvalid={errors.nickname}>
            <FormLabel>Nickname</FormLabel>
            <Input name="nickname" value={formData.nickname} onChange={handleChange} />
            <FormErrorMessage>{errors.nickname}</FormErrorMessage>
          </FormControl>

          <FormControl mb={3} isInvalid={errors.real_name}>
            <FormLabel>Real Name</FormLabel>
            <Input name="real_name" value={formData.real_name} onChange={handleChange} />
            <FormErrorMessage>{errors.real_name}</FormErrorMessage>
          </FormControl>

          <FormControl mb={3} isInvalid={errors.origin_description}>
            <FormLabel>Origin Description</FormLabel>
            <Textarea name="origin_description" value={formData.origin_description} onChange={handleChange} />
            <FormErrorMessage>{errors.origin_description}</FormErrorMessage>
          </FormControl>

          <FormControl mb={3} isInvalid={errors.superpowers}>
            <FormLabel>Superpowers</FormLabel>
            <Textarea name="superpowers" value={formData.superpowers} onChange={handleChange} />
            <FormErrorMessage>{errors.superpowers}</FormErrorMessage>
          </FormControl>

          <FormControl mb={3} isInvalid={errors.catch_phrase}>
            <FormLabel>Catch Phrase</FormLabel>
            <Input name="catch_phrase" value={formData.catch_phrase} onChange={handleChange} />
            <FormErrorMessage>{errors.catch_phrase}</FormErrorMessage>
          </FormControl>

          <FormControl mb={2} isInvalid={errors.image}>
            <FormLabel>Main Image (optional)</FormLabel>
            <Text fontSize="sm" color="gray.500" mb={2}>
              You can add one image either as a file or a URL. This image will be used as the main image for the hero.
            </Text>
            <ImageUploader
              imageUrl={formData.imageUrl}
              onFileSelect={handleImageUpload}
              onUrlChange={handleImageUrlChange}
              single
            />
            <FormErrorMessage>{errors.image}</FormErrorMessage>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="teal" mr={3} onClick={handleSubmit}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
