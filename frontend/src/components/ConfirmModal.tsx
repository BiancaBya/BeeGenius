import React from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

const ContentWrapper = styled.div`
  padding: 30px;
  text-align: center;
`;

const Message = styled.p`
  font-size: 1.2rem;
  margin-bottom: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const ModalButton = styled.button<{ variant?: 'cancel' | 'confirm' }>`
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  background-color: ${props => props.variant === 'cancel' ? '#ccc' : '#d9534f'};
  color: ${props => props.variant === 'cancel' ? '#000' : '#fff'};

  &:hover {
    background-color: ${props => props.variant === 'cancel' ? '#b3b3b3' : '#c9302c'};
  }
`;

interface ConfirmModalProps {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const customStyles: Modal.Styles = {
    content: {
        maxWidth: '400px',
        margin: 'auto',
        borderRadius: '10px',
        padding: '0',
        border: 'none',
        inset: 'unset'
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
                                                       isOpen,
                                                       message,
                                                       onConfirm,
                                                       onCancel
                                                   }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onCancel}
            style={customStyles}
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
        >
            <ContentWrapper>
                <Message>{message}</Message>
                <ButtonGroup>
                    <ModalButton variant="cancel" onClick={onCancel}>Cancel</ModalButton>
                    <ModalButton variant="confirm" onClick={onConfirm}>Delete</ModalButton>
                </ButtonGroup>
            </ContentWrapper>
        </Modal>
    );
};

export default ConfirmModal;
