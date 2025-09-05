// --- Класс HeroScalingController ---
class HeroScalingController {
    constructor() {
        this.heroImage = document.getElementById('heroImage');
        this.heroSection = document.querySelector('.hero-section');
        this.textContentSection = document.querySelector('.text-content-section');
        this.heroOverlay = document.querySelector('.hero-overlay');

        this.isAttached = false;
        this.maxScale = 5; // Максимальное увеличение
        this.attachmentThreshold = 0.8; // Порог прилипания (80% увеличенного изображения)
        this.windowHeight = window.innerHeight;
        this.heroHeight = this.heroSection ? this.heroSection.offsetHeight : 0;

        this.init();
    }

    init() {
        // Проверка на существование необходимых элементов
        if (!this.heroImage || !this.heroSection || !this.textContentSection) {
            console.warn("HeroScalingController: Не найдены необходимые элементы. Контроллер отключен.");
            return;
        }
        this.bindScrollEvents();
        this.bindResizeEvents();
        this.setupInitialState();
    }

    setupInitialState() {
        if (this.heroImage) {
            this.heroImage.style.transform = 'scale(1)';
            // this.heroImage.style.willChange = 'transform'; // Можно включить, если анимация не плавная
        }
        document.body.classList.remove('scaling-phase', 'attached-phase');
    }

    bindScrollEvents() {
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleHeroScaling();
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true }); // passive для лучшей производительности
        // Вызываем сразу, чтобы установить начальное состояние
        onScroll();
    }

    bindResizeEvents() {
        const onResize = () => {
            this.windowHeight = window.innerHeight;
            this.heroHeight = this.heroSection.offsetHeight;

            // ВАЖНО: При ресайзе сбрасываем transform, чтобы браузер пересчитал layout
            // Это решает проблему с не масштабированием фиксированного изображения
            if (this.heroImage) {
                this.heroImage.style.willChange = 'auto'; // Временно отключаем
                // Принудительный пересчет стилей браузером
                this.heroImage.offsetHeight; 
                this.heroImage.style.willChange = 'transform'; // Включаем обратно
            }
            // Также пересчитываем масштабирование после ресайза
            this.handleHeroScaling();
        };
        window.addEventListener('resize', onResize, { passive: true });
        // Вызываем сразу, чтобы установить начальные размеры
        onResize();
    }


    handleHeroScaling() {
        // Проверяем, существует ли элемент heroImage
        if (!this.heroImage) return;

        const scrollTop = window.pageYOffset;
        const textSectionTop = this.textContentSection.offsetTop;
        const scrollRange = textSectionTop - this.windowHeight;

        // Избегаем деления на ноль
        if (scrollRange <= 0) return;

        const scrollProgress = Math.min(Math.max(scrollTop / scrollRange, 0), 1);
        const scale = 1 + (scrollProgress * (this.maxScale - 1));

        this.heroImage.style.transform = `scale(${scale})`;

        // Fade out overlay
        if (scrollProgress > 0.1) {
            document.body.classList.add('scaling-phase');
            const overlayOpacity = Math.max(0, 1 - (scrollProgress - 0.1) * 2);
            if (this.heroOverlay) {
                this.heroOverlay.style.opacity = overlayOpacity;
            }
        } else {
            document.body.classList.remove('scaling-phase');
            if (this.heroOverlay) {
                this.heroOverlay.style.opacity = '1';
            }
        }

        // Hide hero after certain scroll point
        const scaledImageHeight = this.windowHeight * scale;
        const hideHeroThreshold = scaledImageHeight * 1.5;
        if (scrollTop > hideHeroThreshold) {
            this.heroImage.style.opacity = '0';
        } else if (scale >= 1) {
            this.heroImage.style.opacity = '1';
        }

        this.handleTextContentOverlap(scrollTop, scale, scrollProgress);
    }


    handleTextContentOverlap(scrollTop, scale, scrollProgress) {
        const scaledImageHeight = this.windowHeight * scale;
        const attachmentPoint = scaledImageHeight * this.attachmentThreshold;

        if (scrollTop > attachmentPoint && !this.isAttached) {
            this.attachTextContent();
        } else if (scrollTop <= attachmentPoint && this.isAttached) {
            this.detachTextContent();
        }

        // Плавное появление текста до прилипания (по желанию)
        // if (scrollProgress > 0.3 && !this.isAttached) {
        //     const overlapProgress = Math.min((scrollProgress - 0.3) / 0.3, 1);
        //     const translateY = -overlapProgress * 0;
        //     this.textContentSection.style.transform = `translateY(${translateY}px)`;
        // }
    }

    attachTextContent() {
        this.isAttached = true;
        document.body.classList.add('attached-phase');
        // Убедимся, что transform сбрасывается
        this.textContentSection.style.transform = 'translateY(0)';
    }

    detachTextContent() {
        this.isAttached = false;
        document.body.classList.remove('attached-phase');
        // Можно добавить transform при отлипании, если нужно анимационное восстановление
        // this.textContentSection.style.transform = 'translateY(100px)'; 
    }
}

// --- Мобильное меню и другие функции ---

// FAQ Accordion
function initFAQAccordion() {
    const faqToggles = document.querySelectorAll('.faq-question');
    faqToggles.forEach(button => {
        // Убеждаемся, что у summary есть role и aria-expanded
        if (button.tagName === 'SUMMARY') {
             button.setAttribute('aria-expanded', button.parentElement.hasAttribute('open'));
        }
        button.addEventListener('click', () => {
            // Для <summary> браузер сам управляет атрибутом open
            if (button.tagName === 'SUMMARY') {
                // Немного подождем, чтобы браузер обновил атрибут open
                setTimeout(() => {
                     button.setAttribute('aria-expanded', button.parentElement.hasAttribute('open'));
                }, 0);
            } else {
                // Если это не summary, управляем вручную (старый способ)
                const expanded = button.getAttribute('aria-expanded') === 'true';
                button.setAttribute('aria-expanded', !expanded);
            }
        });
    });
}

// Мобильное меню
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (!menuToggle || !mobileMenu) {
        console.warn("Мобильное меню: Не найдены элементы #menuToggle или #mobileMenu.");
        return;
    }

    // Используем aria-expanded для состояния кнопки
    menuToggle.setAttribute('aria-expanded', 'false');

    menuToggle.addEventListener('click', function (e) {
        e.stopPropagation(); // Предотвращаем всплытие клика на document
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        
        // Переключаем отображение меню
        if (mobileMenu.style.display === 'flex') {
            mobileMenu.style.display = 'none';
            this.classList.remove('active'); // Убираем класс для анимации иконки
        } else {
            mobileMenu.style.display = 'flex';
            this.classList.add('active'); // Добавляем класс для анимации иконки
        }
    });

    // Закрытие меню при клике вне его
    document.addEventListener('click', function (e) {
        // Если клик был не по кнопке меню и не по самому меню
        if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
            // Проверяем, открыто ли меню
            if (mobileMenu.style.display === 'flex') {
                menuToggle.setAttribute('aria-expanded', 'false');
                mobileMenu.style.display = 'none';
                menuToggle.classList.remove('active');
            }
        }
    });

     // Закрытие меню при изменении размера окна (если экран стал большим)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) { // Предполагаем, что 768px - точка перехода
             if (mobileMenu.style.display === 'flex') {
                menuToggle.setAttribute('aria-expanded', 'false');
                mobileMenu.style.display = 'none';
                menuToggle.classList.remove('active');
            }
        }
    });
}

// Подсветка активного пункта меню (если используется)
function initActiveMenuLink() {
    const navLinks = document.querySelectorAll('.nav-desktop a, .nav-mobile a');

    if (navLinks.length === 0) return; // Если ссылок нет, выходим

    function setActiveLink() {
        let current = '';
        // Используем getElementsByTagName для большей надежности
        const sections = document.getElementsByTagName('section'); 

        // Проходим по всем секциям с id
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            if (!section.id) continue; // Пропускаем секции без id

            const sectionTop = section.offsetTop;
            // const sectionHeight = section.clientHeight; // Можно использовать для более точного определения

            // Если позиция скролла >= верхней границы секции - 1/3 высоты экрана
            if (pageYOffset >= (sectionTop - window.innerHeight / 3)) {
                current = section.id;
            }
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            // Проверяем, совпадает ли href ссылки с #id текущей секции
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Слушаем событие скролла
    window.addEventListener('scroll', setActiveLink);
    // Вызываем сразу при загрузке страницы
    setActiveLink();
}


// --- Инициализация после загрузки DOM ---
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем контроллер героя
    window.heroController = new HeroScalingController();

    // Инициализируем аккордеон FAQ
    initFAQAccordion();

    // Инициализируем мобильное меню
    initMobileMenu();

    // Инициализируем подсветку активных ссылок
    initActiveMenuLink();

    // Если нужно, можно инициализировать другие компоненты здесь
});
document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.getElementById('menuToggle');
  const menuClose = document.getElementById('menuClose'); // Новая кнопка
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      mobileMenu.classList.toggle('active');
      this.classList.toggle('active');
    });
  }

  // Новый обработчик для кнопки закрытия
  if (menuClose && mobileMenu) {
    menuClose.addEventListener('click', function () {
      mobileMenu.classList.remove('active');
      // Также убираем класс active с иконки гамбургера, если она его имеет
      if (menuToggle && menuToggle.classList.contains('active')) {
        menuToggle.classList.remove('active');
      }
    });
  }
});