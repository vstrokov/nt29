document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('callOrderForm');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Получаем значения полей
      const name = document.getElementById('clientName').value;
      const phone = document.getElementById('clientPhone').value;
      const service = document.getElementById('serviceType').value;
      
      // Простая валидация
      if (!name || !phone || !service) {
        alert('Пожалуйста, заполните все поля');
        return;
      }
      
      // Здесь будет код отправки формы
      // Пока показываем сообщение об успехе
      alert(`Спасибо, ${name}! Мы свяжемся с вами по номеру ${phone} в ближайшее время.`);
      
      // Очищаем форму
      form.reset();
    });
  }
  
  // Маска для телефона (опционально)
  const phoneInput = document.getElementById('clientPhone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);
      
      if (value.length >= 1) {
        value = '+7 (' + value.slice(1);
      }
      if (value.length >= 4) {
        value = value.slice(0, 7) + ') ' + value.slice(7);
      }
      if (value.length >= 9) {
        value = value.slice(0, 12) + '-' + value.slice(12);
      }
      if (value.length >= 12) {
        value = value.slice(0, 15) + '-' + value.slice(15);
      }
      
      e.target.value = value;
    });
  }
});


document.addEventListener('DOMContentLoaded', function() {
  // Ваши реальные отзывы
  const reviews = [
    {
      name: "Андрей Петров",
      date: "15 апреля 2024",
      rating: 5,
      text: "Сварили поддон картера на отлично! Качество работы на высоте, цена адекватная. Рекомендую всем в Архангельске!"
    },
    {
      name: "Михаил Сидоров", 
      date: "10 апреля 2024",
      rating: 4,
      text: "Быстрый выезд, профессиональная работа. Сделали за пару часов, все четко и по делу. Спасибо!"
    },
    {
      name: "Иван Козлов",
      date: "5 апреля 2024", 
      rating: 5,
      text: "Отличный сервис! Работают аккуратно, без задержек. Гарантию дали, очень доволен результатом."
    },
    {
      name: "Сергей Волков",
      date: "1 апреля 2024",
      rating: 4,
      text: "Хорошие специалисты, качественная сварка. Единственное - немного задержались с выездом, но результат стоит."
    },
    {
      name: "Дмитрий Морозов",
      date: "25 марта 2024",
      rating: 5,
      text: "Спасли мой автомобиль! Работа выполнена профессионально, гарантию дали. Очень доволен сервисом."
    }
  ];

  // Фильтруем только отзывы с 4 и 5 звездами
  const filteredReviews = reviews.filter(review => review.rating >= 4);
  
  // Отображаем отзывы
  displayReviews(filteredReviews);
  
  // Инициализация навигации
  setTimeout(() => {
    updateNavigationButtons(0, filteredReviews.length);
  }, 100);
});

// Отображение отзывов
function displayReviews(reviews) {
  const container = document.getElementById('reviewsContainer');
  container.innerHTML = '';
  
  if (reviews.length === 0) {
    container.innerHTML = `
      <div class="review-card">
        <div class="review-text">Пока нет отзывов с высоким рейтингом</div>
      </div>
    `;
    return;
  }
  
  reviews.forEach(review => {
    const ratingStars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    
    const reviewCard = document.createElement('div');
    reviewCard.className = 'review-card';
    reviewCard.innerHTML = `
      <div class="review-header">
        <div class="review-avatar">${review.name.charAt(0)}</div>
        <div class="review-info">
          <div class="review-name">${review.name}</div>
          <div class="review-date">${review.date}</div>
          <div class="review-rating">${ratingStars}</div>
        </div>
      </div>
      <div class="review-text">${review.text}</div>
    `;
    
    container.appendChild(reviewCard);
  });
}

// Обновление состояния кнопок навигации
function updateNavigationButtons(currentIndex, totalReviews) {
  const prevBtn = document.getElementById('prevReview');
  const nextBtn = document.getElementById('nextReview');
  
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = totalReviews <= 1 || currentIndex >= totalReviews - 1;
}

// Навигация по отзывам
let currentReview = 0;

// Делегирование событий для кнопок (так как они создаются динамически)
document.addEventListener('click', function(e) {
  if (e.target.id === 'nextReview') {
    const reviews = document.querySelectorAll('.review-card');
    const maxIndex = Math.max(0, reviews.length - 1);
    
    if (currentReview < maxIndex) {
      currentReview++;
      document.getElementById('reviewsContainer').style.transform = `translateX(-${currentReview * 100}%)`;
      updateNavigationButtons(currentReview, reviews.length);
    }
  }
  
  if (e.target.id === 'prevReview') {
    if (currentReview > 0) {
      currentReview--;
      document.getElementById('reviewsContainer').style.transform = `translateX(-${currentReview * 100}%)`;
      updateNavigationButtons(currentReview, document.querySelectorAll('.review-card').length);
    }
  }
});
