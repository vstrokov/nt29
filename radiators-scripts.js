// Исправленный слайдер для отзывов
document.addEventListener('DOMContentLoaded', function() {
  const reviewsContainer = document.getElementById('reviewsContainer');
  const prevButton = document.getElementById('prevReview');
  const nextButton = document.getElementById('nextReview');
  
  if (!reviewsContainer || !prevButton || !nextButton) return;
  
  const reviewCards = reviewsContainer.querySelectorAll('.review-card');
  const cardCount = reviewCards.length;
  let currentIndex = 0;
  
  // Функция обновления слайдера
  function updateSlider() {
    const translateX = -currentIndex * 100;
    reviewsContainer.style.transform = `translateX(${translateX}%)`;
    
    // Обновляем состояние кнопок
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === cardCount - 1;
  }
  
  // Обработчики кнопок
  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });
  
  nextButton.addEventListener('click', () => {
    if (currentIndex < cardCount - 1) {
      currentIndex++;
      updateSlider();
    }
  });
  
  // Инициализация
  updateSlider();
  
  // Адаптация к изменению размера окна
  window.addEventListener('resize', updateSlider);
});