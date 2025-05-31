import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CaretLeft, CaretRight, Plus, PencilSimple, Trash, X } from '@phosphor-icons/react';
import './CardPage.css';

const Card3D = ({ card, isActive, onEdit, onDelete }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!isActive || isFlipped) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 15;
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 15;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    if (!isFlipped) {
      setRotation({ x: 0, y: 0 });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`card-3d-wrapper glassmorphic ${isActive ? 'active' : ''} ${isFlipped ? 'flipped' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => isActive && setIsFlipped(!isFlipped)}
      style={{
        transform: isFlipped
          ? 'rotateY(180deg)'
          : `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card-3d-front">
        <div className="card-3d-content">
          <div className="card-header" style={{ backgroundColor: card.headerColor || '#7B2CBF' }}>
            <h3 className="card-title">{card.title}</h3>
          </div>
          <div className="card-number">{card.number}</div>
          <div className="card-holder-name">{card.holderName}</div>
          <div className="card-expires">
            <span>EXP</span>
            <span>{card.expiry}</span>
          </div>
          <div className="card-chip"></div>
          <div className="card-type">{card.type}</div>
        </div>
      </div>
      <div className="card-3d-back">
        <div className="card-3d-content">
          <div className="card-magnetic-strip"></div>
          <div className="card-back-content">
            <p className="card-details">{card.details}</p>
            <div className="card-actions">
              <motion.button
                className="card-action-btn edit"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PencilSimple size={20} />
                <span>Edit</span>
              </motion.button>
              <motion.button
                className="card-action-btn delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trash size={20} />
                <span>Delete</span>
              </motion.button>
            </div>
          </div>
          <div className="card-security-code">
            <span>CVV</span>
            <span className="code">{card.cvv}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CardCarousel = ({ cards, onEditCard, onDeleteCard }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const navigateNext = () => {
    if (cards.length > 1) {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }
  };

  const navigatePrev = () => {
    if (cards.length > 1) {
      setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }
  };

  return (
    <div className="carousel-container">
      <div className="carousel-track">
        {cards.map((card, index) => {
          const position = index - activeIndex;
          return (
            <motion.div
              key={card.id}
              className={`carousel-item ${index === activeIndex ? 'active' : ''}`}
              style={{
                transform: `translateX(${position * 100}%) scale(${
                  index === activeIndex ? 1 : 0.8
                })`,
                zIndex: index === activeIndex ? 10 : 5 - Math.abs(position),
                opacity: Math.abs(position) > 1 ? 0 : 1,
              }}
            >
              <Card3D
                card={card}
                isActive={index === activeIndex}
                onEdit={() => onEditCard(card)}
                onDelete={() => onDeleteCard(card.id)}
              />
            </motion.div>
          );
        })}
      </div>
      {cards.length > 1 && (
        <div className="carousel-controls">
          <motion.button
            className="carousel-control prev"
            onClick={navigatePrev}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <CaretLeft size={24} />
          </motion.button>
          <div className="carousel-indicators">
            {cards.map((_, index) => (
              <button
                key={index}
                className={`carousel-indicator ${index === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
          <motion.button
            className="carousel-control next"
            onClick={navigateNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <CaretRight size={24} />
          </motion.button>
        </div>
      )}
    </div>
  );
};

const CardPage = () => {
  const [cards, setCards] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  useEffect(() => {
    const savedCards = localStorage.getItem('cards');
    if (savedCards) {
      try {
        setCards(JSON.parse(savedCards));
      } catch (error) {
        console.error('Error parsing saved cards:', error);
        setCards([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cards', JSON.stringify(cards));
  }, [cards]);

  const handleAddCard = () => {
    setEditingCard(null);
    setIsFormOpen(true);
  };

  const handleSaveCard = (card) => {
    if (editingCard) {
      setCards(cards.map((c) => (c.id === card.id ? card : c)));
    } else {
      setCards([...cards, { ...card, id: Date.now().toString() }]);
    }
    setIsFormOpen(false);
    setEditingCard(null);
  };

  return (
    <div className="card-manager-container">
      <div className="page-header">
        <h1 className="cyber-title">Card Manager</h1>
        <motion.button
          className="cyber-button add-card-btn"
          onClick={handleAddCard}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="button-icon" />
          <span>Add Card</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {cards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="empty-state glassmorphic"
          >
            <div className="empty-state-content">
              <h2>No Cards Found</h2>
              <p>Add your first card to get started</p>
            </div>
          </motion.div>
        ) : (
          <CardCarousel
            cards={cards}
            onEditCard={(card) => {
              setEditingCard(card);
              setIsFormOpen(true);
            }}
            onDeleteCard={(id) => setCards(cards.filter((card) => card.id !== id))}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            className="form-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="form-container glassmorphic"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="form-header">
                <h2>{editingCard ? 'Edit Card' : 'Add New Card'}</h2>
                <motion.button
                  className="close-btn"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingCard(null);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>
              {/* Form content here */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CardPage;