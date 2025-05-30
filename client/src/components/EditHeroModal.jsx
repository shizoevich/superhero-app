import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, VStack, FormControl, FormLabel, Input,
  Textarea, Text, Button
} from '@chakra-ui/react';
import ImageUpload from './ImageUploader';

export default function EditHeroModal({
  isOpen, onClose, onSubmit, formData, onChange,
  newImages, onFileChange, onRemoveNewImage
}) {
  const fields = [
    { label: 'Nickname', name: 'nickname', type: 'text' },
    { label: 'Real Name', name: 'real_name', type: 'text' },
    { label: 'Origin Description', name: 'origin_description', type: 'textarea' },
    { label: 'Superpowers', name: 'superpowers', type: 'textarea' },
    { label: 'Catch Phrase', name: 'catch_phrase', type: 'textarea' },
  ];

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Hero: {formData.nickname}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form id="edit-hero-form" onSubmit={onSubmit}>
            <VStack spacing={4} align="stretch">
              {fields.map(({ label, name, type }) => (
                <FormControl key={name} isRequired>
                  <FormLabel>
                    {label} <Text as="span" color="red.500"></Text>
                  </FormLabel>
                  {type === 'textarea' ? (
                    <Textarea
                      name={name}
                      value={formData[name]}
                      onChange={onChange}
                    />
                  ) : (
                    <Input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={onChange}
                    />
                  )}
                </FormControl>
              ))}
              <ImageUpload
                newImages={newImages}
                onFileChange={onFileChange}
                onRemove={onRemoveNewImage}
              />
            </VStack>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" mr={3} type="submit" form="edit-hero-form">
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
