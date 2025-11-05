import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';

const ModalOverlay = styled.div`
  ${({ $isVisible }) => css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: ${$isVisible ? 'flex' : 'none'};
    justify-content: center;
    align-items: center;
    z-index: 9999;
  `}
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h3`
  color: #dc3545;
  margin-bottom: 15px;
`;

const Message = styled.p`
  margin-bottom: 30px;
  font-size: 1.1em;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;

  ${(props) =>
    props.$primary &&
    css`
      background-color: #dc3545;
      color: white;
      &:hover {
        background-color: #c82333;
      }
    `}

  ${(props) =>
    !props.$primary &&
    css`
      background-color: #6c757d;
      color: white;
      &:hover {
        background-color: #5a6268;
      }
    `}
`;


const ModalConfirmacion = ({ isOpen, message, onConfirm, onCancel, isLoading }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (isOpen && event.key === 'Escape') {
        onCancel();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const modalRoot = document.getElementById('modal-root') || document.body;

  return createPortal(
    <ModalOverlay 
      $isVisible={isOpen} 
      onClick={onCancel}
    >
      <ModalContent onClick={e => e.stopPropagation()}> 
        <Title>¿Estás seguro/a?</Title>
        <Message>{message}</Message>
        <ButtonGroup>
          <Button 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            $primary
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Eliminando...' : 'Confirmar Eliminación'}
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>,
    modalRoot
  );
};

export default ModalConfirmacion;