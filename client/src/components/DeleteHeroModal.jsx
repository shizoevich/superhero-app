import {
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalCloseButton, ModalBody, ModalFooter, Button
} from '@chakra-ui/react';

export default function DeleteHeroModal({ isOpen, onClose, onDelete, nickname }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Delete</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete hero <b>{nickname}</b>?
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
          <Button colorScheme="red" onClick={onDelete}>Delete</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
