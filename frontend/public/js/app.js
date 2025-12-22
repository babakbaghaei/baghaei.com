/**
 * Baghaei Tech Group - Dark Psychology & Minimal Design
 */

(function() {
    'use strict';

    // ========== Utility Functions ==========
    const utils = {
        $(selector, context = document) {
            try {
                return context.querySelector(selector);
            } catch (error) {
                console.error(`Invalid selector: ${selector}`, error);
                return null;
            }
        },

        $$(selector, context = document) {
            try {
                return Array.from(context.querySelectorAll(selector));
            } catch (error) {
                console.error(`Invalid selector: ${selector}`, error);
                return [];
            }
        }
    };

    // ========== Dark Mode Module with System Detection ==========
    const darkMode = {
        currentTheme: 'light',
        
        init() {
            // Don't interfere with themeToggle - let it handle theme
            // This module is kept for compatibility but won't force light mode
        },

        setTheme(theme) {
            // Don't force light mode - let themeToggle handle it
            this.currentTheme = theme;
            localStorage.setItem('theme', theme);
            
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
            document.documentElement.classList.remove('dark');
            }
            
            this.updateIcons();
            this.updateThemeDropdown();
        },

        updateIcons() {
            const isDark = document.documentElement.classList.contains('dark');
            const themeIcon = utils.$('#theme-icon');
            
            if (themeIcon) {
                if (isDark) {
                    themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />';
                } else {
                    themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />';
                }
            }
        },

        updateThemeDropdown() {
            const lightIcon = utils.$('.theme-light-icon');
            const darkIcon = utils.$('.theme-dark-icon');
            const systemIcon = utils.$('.theme-system-icon');
            
            [lightIcon, darkIcon, systemIcon].forEach(icon => {
                if (icon) icon.classList.remove('active');
            });
            
            if (this.currentTheme === 'light' && lightIcon) {
                lightIcon.classList.add('active');
            } else if (this.currentTheme === 'dark' && darkIcon) {
                darkIcon.classList.add('active');
            } else if (this.currentTheme === 'system' && systemIcon) {
                systemIcon.classList.add('active');
            }
        }
    };

    // ========== Mobile Menu Module ==========
    const mobileMenu = {
        isOpen: false,
        menu: null,
        menuIcon: null,
        closeIcon: null,

        init() {
            this.menu = utils.$('#mobile-menu');
            this.menuIcon = utils.$('#menu-icon');
            this.closeIcon = utils.$('#close-icon');
        },

        toggle() {
            if (!this.menu) return;
            
            this.isOpen = !this.isOpen;
            this.menu.classList.toggle('hidden');
            
            if (this.menuIcon && this.closeIcon) {
                this.menuIcon.classList.toggle('hidden', this.isOpen);
                this.closeIcon.classList.toggle('hidden', !this.isOpen);
            }
            
            document.body.style.overflow = this.isOpen ? 'hidden' : '';
        }
    };

    // ========== Logo Animation Module - Fixed ==========
    const logoAnimation = {
        init() {
            const logoContainer = utils.$('.logo-container');
            if (!logoContainer) return;

            const fullText = utils.$('#logo-text-full');
            const shortText = utils.$('#logo-text-short');
            
            if (!fullText || !shortText) return;

            // Initial: show full text
            fullText.style.opacity = '1';
            shortText.style.opacity = '0';

            // After 2 seconds, hide full text and show short text
            setTimeout(() => {
                fullText.style.opacity = '0';
                shortText.style.opacity = '1';
            }, 2000);

            // Hover: show full text again
            logoContainer.addEventListener('mouseenter', () => {
                fullText.style.opacity = '1';
                shortText.style.opacity = '0';
            });

            logoContainer.addEventListener('mouseleave', () => {
                fullText.style.opacity = '0';
                shortText.style.opacity = '1';
            });
        }
    };

    // ========== Active Section Detection ==========
    const activeSection = {
        init() {
            const sections = utils.$$('section[id]');
            const navLinks = utils.$$('.nav-link');
            
            if (sections.length === 0 || navLinks.length === 0) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${id}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            }, { threshold: 0.3, rootMargin: '-100px 0px -100px 0px' });

            sections.forEach(section => observer.observe(section));
        }
    };

    // ========== Scroll Animations ==========
    const scrollAnimations = {
        init() {
            const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            const elements = utils.$$('section > div, section > h2, section > p');
            elements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
        }
    };

    // ========== Parallax Effect for Hero Shapes ==========
    const parallaxShapes = {
        shapes: [],
        heroSection: null,
        
        init() {
            this.heroSection = utils.$('#hero');
            if (!this.heroSection) return;
            
            const shapeElements = utils.$$('.parallax-shape');
            if (shapeElements.length === 0) return;
            
            // Store initial positions and speeds
            shapeElements.forEach(shape => {
                const speed = parseFloat(shape.getAttribute('data-speed')) || 0.3;
                
                this.shapes.push({
                    element: shape,
                    speed: speed
                });
            });
            
            // Throttle scroll event for performance
            let ticking = false;
            const handleScroll = () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        this.update();
                        ticking = false;
                    });
                    ticking = true;
                }
            };
            
            window.addEventListener('scroll', handleScroll, { passive: true });
            window.addEventListener('resize', handleScroll, { passive: true });
            
            // Initial update
            this.update();
        },
        
        update() {
            if (!this.heroSection || this.shapes.length === 0) return;
            
            const scrollY = window.pageYOffset || window.scrollY || document.documentElement.scrollTop;
            const heroRect = this.heroSection.getBoundingClientRect();
            const heroTop = heroRect.top + scrollY;
            const heroHeight = heroRect.height;
            const windowHeight = window.innerHeight;
            
            // Calculate scroll position relative to hero section
            const scrollPosition = scrollY - heroTop;
            const maxScroll = heroHeight + windowHeight;
            
            // Only apply parallax when hero is in viewport or just scrolled past
            if (scrollPosition < -windowHeight || scrollPosition > maxScroll) return;
            
            // Calculate scroll progress (0 to 1)
            const scrollProgress = Math.max(0, Math.min(1, (scrollPosition + windowHeight) / maxScroll));
            
            this.shapes.forEach(shape => {
                // Move shapes based on scroll progress and speed - reduced intensity
                const offset = (scrollProgress - 0.5) * 100 * shape.speed; // Reduced from 300 to 100
                
                // Apply transform for smooth movement with will-change optimization
                shape.element.style.willChange = 'transform';
                shape.element.style.transform = `translateY(${offset}px)`;
            });
        }
    };


    // ========== Consultation Booking Module ==========
    const consultationForm = {
        init() {
            const form = utils.$('#consultation-form');
            if (!form) return;

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit(form);
            });
        },
        
        initPersianDatePicker(persianDateInput, gregorianDateInput) {
            if (!persianDateInput || !gregorianDateInput) return;
            
            // Get tomorrow in Persian date
            const tomorrow = new persianDate();
            tomorrow.addDay(1);
            
            // Initialize date picker
            $(persianDateInput).pDatepicker({
                observer: true,
                format: 'YYYY/MM/DD',
                altField: gregorianDateInput,
                altFormat: 'YYYY-MM-DD',
                minDate: tomorrow,
                calendarType: 'persian',
                timePicker: false,
                initialValue: false,
                autoClose: true,
                calendar: {
                    persian: {
                        locale: 'fa',
                        showHint: true,
                        selectOtherMonths: false
                    }
                },
                onSelect: (unixDate) => {
                    if (!unixDate) return;
                    
                    const selectedDate = new Date(unixDate);
                    const dayOfWeek = selectedDate.getDay();
                    
                    // Working days: Saturday (6) to Wednesday (3)
                    // Disable: Thursday (4) and Friday (5)
                    if (dayOfWeek === 4 || dayOfWeek === 5) {
                        $(persianDateInput).val('');
                        $(gregorianDateInput).val('');
                        this.showMessage('لطفا یک روز کاری انتخاب کنید (شنبه تا چهارشنبه)', 'error', utils.$('#consultation-message'));
                        // Hide time selection if invalid date
                        const timeContainer = utils.$('#time-selection-container');
                        if (timeContainer) {
                            timeContainer.classList.add('hidden');
                        }
                    } else {
                        // Show time selection container
                        const timeContainer = utils.$('#time-selection-container');
                        if (timeContainer) {
                            timeContainer.classList.remove('hidden');
                        }
                        this.handleDateChange($(gregorianDateInput).val());
                    }
                },
                checkDate: (unixDate) => {
                    if (!unixDate) return false;
                    const date = new Date(unixDate);
                    const dayOfWeek = date.getDay();
                    // Only allow Saturday (6) to Wednesday (3)
                    return dayOfWeek === 6 || dayOfWeek === 0 || dayOfWeek === 1 || dayOfWeek === 2 || dayOfWeek === 3;
                },
                disableDays: [4, 5] // Disable Thursday (4) and Friday (5)
            });
            
            // Make input clickable to open date picker
            $(persianDateInput).on('click focus', function() {
                $(this).pDatepicker('show');
            });
        }
                // Fallback: simple text input with manual validation
                // Make input clickable to trigger date picker if available
                persianDateInput.addEventListener('click', () => {
                    // Try to trigger date picker if it exists
                    if (typeof $ !== 'undefined' && $.fn.pDatepicker) {
                        $(persianDateInput).pDatepicker('show');
                    }
                });
                
                persianDateInput.addEventListener('focus', () => {
                    // Try to trigger date picker if it exists
                    if (typeof $ !== 'undefined' && $.fn.pDatepicker) {
                        $(persianDateInput).pDatepicker('show');
                    } else {
                        const tomorrow = moment().add(1, 'days');
                        const tomorrowPersian = moment(tomorrow).format('jYYYY/jMM/jDD');
                        persianDateInput.placeholder = `حداقل: ${tomorrowPersian}`;
                    }
                });
                
                persianDateInput.addEventListener('blur', () => {
                    const persianDate = persianDateInput.value.trim();
                    if (persianDate && /^\d{4}\/\d{2}\/\d{2}$/.test(persianDate)) {
                        // Convert Persian to Gregorian
                        const [year, month, day] = persianDate.split('/').map(Number);
                        const gregorianDate = moment(`${year}/${month}/${day}`, 'jYYYY/jMM/jDD').format('YYYY-MM-DD');
                        
                        if (gregorianDate && gregorianDate !== 'Invalid date') {
                            gregorianDateInput.value = gregorianDate;
                            const selectedDate = new Date(gregorianDate);
                            const dayOfWeek = selectedDate.getDay();
                            
                            // Working days: Saturday (6) to Wednesday (3)
                            if (dayOfWeek === 4 || dayOfWeek === 5) {
                                persianDateInput.value = '';
                                gregorianDateInput.value = '';
                                this.showMessage('لطفا یک روز کاری انتخاب کنید (شنبه تا چهارشنبه)', 'error', utils.$('#consultation-message'));
                                // Hide time selection if invalid date
                                const timeContainer = utils.$('#time-selection-container');
                                if (timeContainer) {
                                    timeContainer.classList.add('hidden');
                                }
                            } else {
                                // Show time selection container
                                const timeContainer = utils.$('#time-selection-container');
                                if (timeContainer) {
                                    timeContainer.classList.remove('hidden');
                                }
                                this.handleDateChange(gregorianDate);
                            }
                        } else {
                            persianDateInput.value = '';
                            this.showMessage('تاریخ نامعتبر است. فرمت صحیح: ۱۴۰۳/۰۷/۱۵', 'error', utils.$('#consultation-message'));
                        }
                    }
                });
            }
            
            // Fallback: use native date picker and convert
            if (gregorianDateInput && !persianDateInput) {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                gregorianDateInput.min = tomorrow.toISOString().split('T')[0];
                gregorianDateInput.addEventListener('change', (e) => {
                    const selectedDate = new Date(e.target.value);
                    const dayOfWeek = selectedDate.getDay();
                    // Working days: Saturday (6) to Wednesday (3)
                    if (dayOfWeek === 4 || dayOfWeek === 5) {
                        e.target.value = '';
                        this.showMessage('لطفا یک روز کاری انتخاب کنید (شنبه تا چهارشنبه)', 'error', utils.$('#consultation-message'));
                    } else {
                        // Show time selection container
                        const timeContainer = utils.$('#time-selection-container');
                        if (timeContainer) {
                            timeContainer.classList.remove('hidden');
                        }
                        this.handleDateChange(e.target.value);
                    }
                });
            }

            // Time button handlers
            const timeButtons = utils.$$('.consultation-time-btn');
            timeButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.selectTime(btn);
                });
            });

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit(form);
            });
        },

        async handleDateChange(selectedDate) {
            if (!selectedDate) {
                // Reset time selection if no date
                this.selectedTime = null;
                const timeInput = utils.$('#consultation-time');
                if (timeInput) timeInput.value = '';
                
                // Hide time selection container
                const timeContainer = utils.$('#time-selection-container');
                if (timeContainer) {
                    timeContainer.classList.add('hidden');
                }
                
                const timeButtons = utils.$$('.consultation-time-btn');
                timeButtons.forEach(btn => {
                    btn.classList.remove('bg-black', 'text-white', 'border-black');
                    btn.classList.add('bg-white', 'text-gray-900', 'border-gray-200');
                    btn.disabled = false;
                    btn.classList.remove('opacity-50', 'cursor-not-allowed');
                });
                return;
            }
            
            // Show time selection container when date is selected
            const timeContainer = utils.$('#time-selection-container');
            if (timeContainer) {
                timeContainer.classList.remove('hidden');
            }
            
            const date = new Date(selectedDate);
            const dayOfWeek = date.getDay();
            
            // Disable weekends
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                const dateInput = utils.$('#consultation-date');
                if (dateInput) {
                    dateInput.value = '';
                }
                return;
            }

            // Reset time selection when date changes
            this.selectedTime = null;
            const timeInput = utils.$('#consultation-time');
            if (timeInput) timeInput.value = '';
            
            // Fetch booked slots from database
            await this.updateTimeButtons(selectedDate);
        },

        async updateTimeButtons(selectedDate) {
            const timeButtons = utils.$$('.consultation-time-btn');
            const timeInput = utils.$('#consultation-time');
            
            try {
                // Fetch booked slots from database
                const response = await fetch(`/api/get-booked-slots?date=${selectedDate}`);
                const data = await response.json();
                
                const bookedTimes = data.success ? data.bookedTimes : [];
                
                timeButtons.forEach(btn => {
                    const time = btn.getAttribute('data-time');
                    const slotKey = `${selectedDate}_${time}`;
                    
                    // Check if this slot is booked in database
                    const isBooked = bookedTimes.includes(time) || this.bookedSlots.has(slotKey);
                    
                    if (isBooked) {
                        btn.disabled = true;
                        btn.classList.add('opacity-50', 'cursor-not-allowed');
                        btn.classList.remove('hover:border-black', 'bg-white', 'text-gray-900', 'border-gray-200');
                        btn.classList.add('bg-gray-100', 'text-gray-400');
                    } else {
                        btn.disabled = false;
                        btn.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-gray-100', 'text-gray-400');
                        btn.classList.add('bg-white', 'text-gray-900', 'border-gray-200', 'hover:border-black');
                    }
                    
                    // Remove active state
                    if (btn.classList.contains('bg-black', 'text-white')) {
                        btn.classList.remove('bg-black', 'text-white', 'border-black');
                        btn.classList.add('bg-white', 'text-gray-900', 'border-gray-200');
                    }
                });
            } catch (error) {
                console.error('Error fetching booked slots:', error);
                // Fallback: enable all buttons
                timeButtons.forEach(btn => {
                    btn.disabled = false;
                    btn.classList.remove('opacity-50', 'cursor-not-allowed');
                    btn.classList.add('hover:border-black');
                });
            }
            
            if (timeInput) timeInput.value = '';
        },

        selectTime(button) {
            if (button.disabled) return;
            
            // Remove active state from all buttons
            const timeButtons = utils.$$('.consultation-time-btn');
            timeButtons.forEach(btn => {
                btn.classList.remove('bg-black', 'text-white', 'border-black');
                btn.classList.add('bg-white', 'text-gray-900', 'border-gray-200');
            });
            
            // Set active state
            button.classList.remove('bg-white', 'text-gray-900', 'border-gray-200');
            button.classList.add('bg-black', 'text-white', 'border-black');
            
            this.selectedTime = button.getAttribute('data-time');
            const timeInput = utils.$('#consultation-time');
            if (timeInput) timeInput.value = this.selectedTime;
        },

        async handleSubmit(form) {
            const formData = new FormData(form);
            const messageDiv = utils.$('#consultation-message-display');
            
            const name = formData.get('name');
            const email = formData.get('email') || '';
            const phone = formData.get('phone') || '';
            const message = formData.get('message') || '';

            if (!name) {
                this.showMessage('لطفا نام و نام خانوادگی را وارد کنید.', 'error', messageDiv);
                return;
            }

            // At least one contact method should be provided
            if (!email && !phone) {
                this.showMessage('لطفا حداقل یکی از فیلدهای ایمیل یا شماره تماس را پر کنید.', 'error', messageDiv);
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'در حال ارسال...';

            try {
                // Save to database
                const response = await fetch('/api/save-consultation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        phone: phone,
                        message: message
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to save consultation');
                }

                const result = await response.json();
                
                this.showMessage('درخواست شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.', 'success', messageDiv);
                form.reset();
            } catch (error) {
                console.error('Booking error:', error);
                this.showMessage('خطا در ارسال درخواست. لطفا دوباره تلاش کنید یا مستقیماً با ما تماس بگیرید.', 'error', messageDiv);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        },


        showMessage(text, type, element) {
            if (!element) return;
            
            element.textContent = text;
            element.className = `text-xs font-sans text-center ${type === 'success' ? 'text-green-600' : 'text-red-600'}`;
            element.classList.remove('hidden');
    
    setTimeout(() => {
                element.classList.add('hidden');
            }, 5000);
        }
    };

    // ========== Modal Functions ==========
    window.openPrivacyModal = function() {
        const modal = utils.$('#privacy-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closePrivacyModal = function() {
        const modal = utils.$('#privacy-modal');
        if (modal) {
        modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    };

    window.openTermsModal = function() {
        const modal = utils.$('#terms-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeTermsModal = function() {
        const modal = utils.$('#terms-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    };

    window.setTheme = function(theme) {
        darkMode.setTheme(theme);
    };

    // ========== Project Modals ==========
    const projectModals = {
        projects: [
            {
                title: 'پیکسل بال',
                year: '۱۳۹۴',
                tags: ['طراحی', 'صداسازی', 'برنامه‌نویسی'],
                content: `
                    <p class="text-xs text-gray-500 mb-4">۱۳۹۴</p>
                    <h4 class="font-black mb-3">داستان پروژه</h4>
                    <p class="mb-4">در سال ۱۳۹۴، ما با یک چالش بزرگ روبرو شدیم: ساخت یک بازی موبایل که هم سرگرم‌کننده باشد و هم به یاد ماندنی. پیکسل بال نتیجه این تلاش بود - یک بازی پیکسلی فوتبال دو نفره که با طراحی منحصر به فرد و صداسازی حرفه‌ای، تجربه بازی را به سطح جدیدی می‌برد.</p>
                    <p class="mb-4">از همان ابتدا، هدف ما این بود که یک بازی بسازیم که نه تنها از نظر بصری جذاب باشد، بلکه از نظر صوتی هم تجربه‌ای بی‌نقص ارائه دهد. ما ساعت‌ها وقت صرف طراحی صداهای منحصر به فرد برای هر حرکت، هر ضربه و هر لحظه هیجان‌انگیز کردیم.</p>
                    <p class="mb-6">نتیجه این تلاش‌ها چیزی بود که انتظارش را نداشتیم: بیش از ۱۰۰ هزار دانلود و امتیاز ۴.۸ ستاره از کاربران. این موفقیت نشان داد که وقتی طراحی، صداسازی و برنامه‌نویسی در کنار هم قرار می‌گیرند، می‌توانند تجربه‌ای خلق کنند که کاربران را مجذوب خود می‌کند.</p>
                    <h4 class="font-black mb-3">چالش‌ها و راه‌حل‌ها</h4>
                    <p class="mb-4">یکی از بزرگ‌ترین چالش‌های این پروژه، ایجاد تعادل بین سادگی و عمق بازی بود. ما می‌خواستیم بازی‌ای بسازیم که هم برای بازیکنان تازه‌کار قابل فهم باشد و هم برای بازیکنان حرفه‌ای چالش‌برانگیز.</p>
                    <p class="mb-6">راه‌حل ما طراحی یک سیستم کنترل ساده اما عمیق بود که به بازیکنان اجازه می‌داد با تمرین و مهارت، تکنیک‌های پیشرفته‌ای را یاد بگیرند. این رویکرد باعث شد بازی هم برای تازه‌کاران جذاب باشد و هم برای حرفه‌ای‌ها چالش‌برانگیز.</p>
                `
            },
            {
                title: 'مالاتا',
                year: '۱۳۹۶',
                tags: ['طراحی', 'برنامه‌نویسی', 'برندینگ'],
                content: `
                    <p class="text-xs text-gray-500 mb-4">۱۳۹۶</p>
                    <h4 class="font-black mb-3">داستان پروژه</h4>
                    <p class="mb-4">مالاتا در سال ۱۳۹۶ متولد شد - یک پلتفرم فروش ماهی که می‌خواست صنعت فروش آنلاین ماهی را متحول کند. چالش اصلی ما این بود که چگونه می‌توانیم یک تجربه خرید آنلاین برای محصولی تازه و حساس ایجاد کنیم که هم برای فروشنده و هم برای خریدار راحت باشد.</p>
                    <p class="mb-4">ما از صفر شروع کردیم: طراحی برند، هویت بصری، رابط کاربری و تجربه کاربری. هر جزئیات با دقت انتخاب شد تا حس اعتماد و تازگی را به کاربران منتقل کند. نتیجه این تلاش‌ها پلتفرمی بود که بیش از ۵۰۰ فروشنده فعال و هزاران مشتری راضی را جذب کرد.</p>
                    <p class="mb-6">مالاتا نه تنها یک پلتفرم فروش بود، بلکه یک تجربه کامل بود - از طراحی برند تا برنامه‌نویسی و توسعه. این پروژه به ما نشان داد که چگونه می‌توان با ترکیب طراحی، برنامه‌نویسی و برندینگ، یک محصول کامل و موفق خلق کرد.</p>
                    <h4 class="font-black mb-3">چالش‌ها و راه‌حل‌ها</h4>
                    <p class="mb-4">یکی از بزرگ‌ترین چالش‌ها، ایجاد یک سیستم مدیریت موجودی بود که بتواند با ماهی تازه کار کند - محصولی که تاریخ انقضا دارد و باید به سرعت به دست مشتری برسد. ما یک سیستم هوشمند طراحی کردیم که به فروشندگان اجازه می‌داد موجودی خود را به صورت Real-time مدیریت کنند.</p>
                    <p class="mb-6">چالش دیگر، ایجاد اعتماد در خریداران بود. ما با طراحی یک سیستم امتیازدهی و نظرات شفاف، به خریداران کمک کردیم تا با اطمینان خرید کنند. این رویکرد باعث شد مالاتا به یکی از معتبرترین پلتفرم‌های فروش ماهی تبدیل شود.</p>
                `
            },
            {
                title: 'دردودل بات',
                year: '۱۳۹۷',
                tags: ['طراحی', 'برنامه‌نویسی'],
                content: `
                    <p class="text-xs text-gray-500 mb-4">۱۳۹۷</p>
                    <h4 class="font-black mb-3">داستان پروژه</h4>
                    <p class="mb-4">دردودل بات در سال ۱۳۹۷ متولد شد - یک پلتفرم دردودل کردن و همدلی که می‌خواست ارتباطات انسانی را عمیق‌تر کند. چالش اصلی ما این بود که چگونه می‌توانیم با استفاده از هوش مصنوعی پیشرفته، تجربه تعاملی منحصر به فردی را برای کاربران فراهم کنیم.</p>
                    <p class="mb-4">ما از صفر شروع کردیم: طراحی رابط کاربری که هم ساده باشد و هم قدرتمند، برنامه‌نویسی یک سیستم هوش مصنوعی که بتواند احساسات کاربران را درک کند و به آن‌ها پاسخ دهد. نتیجه این تلاش‌ها پلتفرمی بود که بیش از ۵۰ هزار کاربر فعال روزانه را جذب کرد.</p>
                    <p class="mb-6">دردودل بات نه تنها یک ربات بود، بلکه یک دوست دیجیتالی بود که به کاربران کمک می‌کرد احساسات خود را بیان کنند و همدلی پیدا کنند. این پروژه به ما نشان داد که چگونه می‌توان با ترکیب طراحی و برنامه‌نویسی، محصولی خلق کرد که واقعاً به کاربران کمک می‌کند.</p>
                    <h4 class="font-black mb-3">چالش‌ها و راه‌حل‌ها</h4>
                    <p class="mb-4">یکی از بزرگ‌ترین چالش‌ها، ایجاد یک سیستم هوش مصنوعی بود که بتواند احساسات کاربران را درک کند و پاسخ مناسب بدهد. ما با طراحی یک سیستم یادگیری ماشین که از تعاملات کاربران یاد می‌گرفت، این مشکل را حل کردیم.</p>
                    <p class="mb-6">چالش دیگر، ایجاد یک رابط کاربری بود که هم ساده باشد و هم قدرتمند. ما با طراحی یک سیستم مکالمه طبیعی که به کاربران اجازه می‌داد به راحتی با ربات صحبت کنند، این مشکل را حل کردیم.</p>
                `
            },
            {
                title: 'پوشیو',
                year: '۱۳۹۸',
                tags: ['طراحی'],
                content: `
                    <p class="text-xs text-gray-500 mb-4">۱۳۹۸</p>
                    <h4 class="font-black mb-3">داستان پروژه</h4>
                    <p class="mb-4">پوشیو در سال ۱۳۹۸ متولد شد - یک وب‌سایت پوش نوتیفیکیشن که می‌خواست ارتباط بین کسب‌وکارها و مشتریان را بهبود بخشد. چالش اصلی ما این بود که چگونه می‌توانیم یک سیستم نوتیفیکیشن طراحی کنیم که هم موثر باشد و هم مزاحم نباشد.</p>
                    <p class="mb-4">ما با طراحی یک رابط کاربری مینیمال و عملکرد بی‌نقص شروع کردیم. هر جزئیات با دقت انتخاب شد تا تجربه کاربری بهینه‌ای را ارائه دهد. نتیجه این تلاش‌ها سیستمی بود که نرخ بازگشت کاربران را تا ۴۰٪ افزایش داد و مورد اعتماد بیش از ۲۰۰ کسب‌وکار قرار گرفت.</p>
                    <p class="mb-6">پوشیو نه تنها یک سیستم نوتیفیکیشن بود، بلکه یک راهکار کامل برای ارتباط با مشتریان بود. این پروژه به ما نشان داد که چگونه می‌توان با طراحی ساده اما موثر، تاثیر بزرگی بر تجربه کاربری گذاشت.</p>
                    <h4 class="font-black mb-3">چالش‌ها و راه‌حل‌ها</h4>
                    <p class="mb-4">یکی از بزرگ‌ترین چالش‌ها، ایجاد تعادل بین موثر بودن و مزاحم نبودن بود. ما با طراحی یک سیستم هوشمند که زمان و محتوای مناسب برای ارسال نوتیفیکیشن را تشخیص می‌داد، این مشکل را حل کردیم.</p>
                    <p class="mb-6">چالش دیگر، ایجاد یک رابط کاربری بود که هم برای مدیران کسب‌وکارها و هم برای کاربران نهایی ساده باشد. ما با طراحی یک داشبورد مدیریتی قدرتمند و یک تجربه کاربری ساده، این مشکل را حل کردیم.</p>
                `
            },
            {
                title: 'راورو',
                year: '۱۳۹۸',
                tags: ['طراحی'],
                content: `
                    <p class="text-xs text-gray-500 mb-4">۱۳۹۸</p>
                    <h4 class="font-black mb-3">داستان پروژه</h4>
                    <p class="mb-4">راورو در سال ۱۳۹۸ متولد شد - یک پروژه طراحی رابط کاربری که می‌خواست تجربه کاربری را به سطح جدیدی ببرد. چالش اصلی ما این بود که چگونه می‌توانیم یک رابط کاربری طراحی کنیم که هم مدرن باشد و هم کاربرپسند.</p>
                    <p class="mb-4">ما با تمرکز بر تجربه کاربری شروع کردیم. هر المان، هر رنگ، هر فونت با دقت انتخاب شد تا بهترین تجربه ممکن را برای کاربران فراهم کند. نتیجه این تلاش‌ها رابط کاربری بود که رضایت مشتریان را به بالاترین سطح رساند.</p>
                    <p class="mb-6">راورو نه تنها یک طراحی بود، بلکه یک تجربه کامل بود. این پروژه به ما نشان داد که چگونه می‌توان با تمرکز بر جزئیات و تجربه کاربری، محصولی خلق کرد که کاربران را مجذوب خود می‌کند.</p>
                    <h4 class="font-black mb-3">چالش‌ها و راه‌حل‌ها</h4>
                    <p class="mb-4">یکی از بزرگ‌ترین چالش‌ها، ایجاد تعادل بین زیبایی و عملکرد بود. ما با طراحی یک سیستم طراحی که هم زیبا بود و هم کاربردی، این مشکل را حل کردیم.</p>
                    <p class="mb-6">چالش دیگر، ایجاد یک تجربه کاربری بود که برای همه کاربران، از تازه‌کار تا حرفه‌ای، مناسب باشد. ما با طراحی یک سیستم راهنمایی و آموزش تعاملی، این مشکل را حل کردیم.</p>
                `
            },
            {
                title: 'تیونینگ کیوانی',
                year: '۱۳۹۹',
                tags: ['طراحی'],
                content: `
                    <p class="text-xs text-gray-500 mb-4">۱۳۹۹</p>
                    <h4 class="font-black mb-3">داستان پروژه</h4>
                    <p class="mb-4">تیونینگ کیوانی در سال ۱۳۹۹ متولد شد - یک پروژه طراحی برند و هویت بصری برای تیونینگ ماشین که می‌خواست برند را در بازار رقابتی متمایز کند. چالش اصلی ما این بود که چگونه می‌توانیم یک هویت بصری طراحی کنیم که هم منحصر به فرد باشد و هم با روح برند هماهنگ باشد.</p>
                    <p class="mb-4">ما با طراحی یک استایل منحصر به فرد شروع کردیم که هم مدرن بود و هم کلاسیک. هر المان، از لوگو تا رنگ‌ها، با دقت انتخاب شد تا هویت برند را به بهترین شکل نمایش دهد. نتیجه این تلاش‌ها هویت بصری بود که برند را در بازار رقابتی متمایز کرد و باعث افزایش ۶۰٪ در بازدید و فروش شد.</p>
                    <p class="mb-6">تیونینگ کیوانی نه تنها یک طراحی برند بود، بلکه یک تجربه کامل بود. این پروژه به ما نشان داد که چگونه می‌توان با طراحی هویت بصری قوی، برند را در بازار رقابتی متمایز کرد.</p>
                    <h4 class="font-black mb-3">چالش‌ها و راه‌حل‌ها</h4>
                    <p class="mb-4">یکی از بزرگ‌ترین چالش‌ها، ایجاد یک هویت بصری بود که هم منحصر به فرد باشد و هم با روح برند هماهنگ باشد. ما با تحقیق عمیق در مورد برند و بازار هدف، این مشکل را حل کردیم.</p>
                    <p class="mb-6">چالش دیگر، ایجاد یک استایل بود که هم برای رسانه‌های سنتی و هم برای رسانه‌های دیجیتال مناسب باشد. ما با طراحی یک سیستم طراحی منعطف که در همه رسانه‌ها کار می‌کرد، این مشکل را حل کردیم.</p>
                `
            },
            {
                title: 'رها EDR',
                year: '۱۴۰۰',
                tags: ['طراحی'],
                content: `
                    <p class="text-xs text-gray-500 mb-4">۱۴۰۰</p>
                    <h4 class="font-black mb-3">داستان پروژه</h4>
                    <p class="mb-4">رها EDR در سال ۱۴۰۰ متولد شد - یک پروژه طراحی رابط کاربری برای انواع سرویس‌های امنیتی که می‌خواست امنیت را در دسترس همه قرار دهد. چالش اصلی ما این بود که چگونه می‌توانیم یک رابط کاربری طراحی کنیم که هم قدرتمند باشد و هم ساده.</p>
                    <p class="mb-4">ما با تمرکز بر امنیت و قابلیت اطمینان شروع کردیم. هر المان، از داشبورد تا سیستم هشدار، با دقت طراحی شد تا بهترین تجربه ممکن را برای کاربران فراهم کند. نتیجه این تلاش‌ها رابط کاربری بود که مورد استفاده بیش از ۱۰۰ سازمان بزرگ قرار گرفت و باعث کاهش ۹۵٪ در حملات سایبری شد.</p>
                    <p class="mb-6">رها EDR نه تنها یک طراحی رابط کاربری بود، بلکه یک راهکار کامل برای امنیت سایبری بود. این پروژه به ما نشان داد که چگونه می‌توان با طراحی رابط کاربری قوی، امنیت را در دسترس همه قرار داد.</p>
                    <h4 class="font-black mb-3">چالش‌ها و راه‌حل‌ها</h4>
                    <p class="mb-4">یکی از بزرگ‌ترین چالش‌ها، ایجاد یک رابط کاربری بود که هم قدرتمند باشد و هم ساده. ما با طراحی یک سیستم لایه‌ای که به کاربران اجازه می‌داد از ساده تا پیشرفته پیش بروند، این مشکل را حل کردیم.</p>
                    <p class="mb-6">چالش دیگر، ایجاد یک سیستم هشدار بود که هم موثر باشد و هم مزاحم نباشد. ما با طراحی یک سیستم هوشمند که فقط هشدارهای مهم را نمایش می‌داد، این مشکل را حل کردیم.</p>
                `
            },
            {
                title: 'فرودگاه کیش',
                year: '۱۴۰۰',
                tags: ['طراحی'],
                content: `
                    <p class="text-xs text-gray-500 mb-4">۱۴۰۰</p>
                    <h4 class="font-black mb-3">داستان پروژه</h4>
                    <p class="mb-4">فرودگاه کیش در سال ۱۴۰۰ متولد شد - یک پروژه طراحی سیستم‌های FIDS و کانتر برای فرودگاه بین‌المللی کیش که می‌خواست تجربه مسافران را بهبود بخشد. چالش اصلی ما این بود که چگونه می‌توانیم یک سیستم طراحی کنیم که هم اطلاعات را به وضوح نمایش دهد و هم تجربه مسافران را بهبود بخشد.</p>
                    <p class="mb-4">ما با دقت و حرفه‌ای‌گری شروع کردیم. هر المان، از نمایش اطلاعات پرواز تا رابط کاربری کانتر، با دقت طراحی شد تا بهترین تجربه ممکن را برای مسافران فراهم کند. نتیجه این تلاش‌ها سیستمی بود که باعث کاهش ۳۰٪ در زمان انتظار و افزایش رضایت مسافران شد و فرودگاه کیش را به یکی از بهترین‌های منطقه تبدیل کرد.</p>
                    <p class="mb-6">فرودگاه کیش نه تنها یک طراحی سیستم بود، بلکه یک تجربه کامل بود. این پروژه به ما نشان داد که چگونه می‌توان با طراحی سیستم‌های قوی، تجربه مسافران را به سطح جدیدی برد.</p>
                    <h4 class="font-black mb-3">چالش‌ها و راه‌حل‌ها</h4>
                    <p class="mb-4">یکی از بزرگ‌ترین چالش‌ها، ایجاد یک سیستم بود که هم اطلاعات را به وضوح نمایش دهد و هم در محیط شلوغ فرودگاه قابل خواندن باشد. ما با طراحی یک سیستم نمایش با فونت‌های بزرگ و رنگ‌های با کنتراست بالا، این مشکل را حل کردیم.</p>
                    <p class="mb-6">چالش دیگر، ایجاد یک سیستم بود که هم برای مسافران فارسی‌زبان و هم برای مسافران بین‌المللی مناسب باشد. ما با طراحی یک سیستم چندزبانه که به راحتی بین زبان‌ها تغییر می‌کرد، این مشکل را حل کردیم.</p>
                `
            },
            {
                title: 'باشگاه رویال اقدسیه',
                year: '۱۴۰۱',
                tags: ['طراحی'],
                content: `
                    <p class="text-xs text-gray-500 mb-4">۱۴۰۱</p>
                    <h4 class="font-black mb-3">داستان پروژه</h4>
                    <p class="mb-4">باشگاه رویال اقدسیه در سال ۱۴۰۱ متولد شد - یک پروژه طراحی برند و هویت بصری برای باشگاه ورزشی لوکس که می‌خواست باشگاه را به مقصدی برتر برای علاقه‌مندان به ورزش تبدیل کند. چالش اصلی ما این بود که چگونه می‌توانیم یک هویت بصری طراحی کنیم که هم لوکس باشد و هم ورزشی.</p>
                    <p class="mb-4">ما با طراحی یک استایل مدرن و حرفه‌ای شروع کردیم. هر المان، از لوگو تا رنگ‌ها، با دقت انتخاب شد تا هویت باشگاه را به بهترین شکل نمایش دهد. نتیجه این تلاش‌ها هویت بصری بود که باشگاه را به مقصدی برتر برای علاقه‌مندان به ورزش تبدیل کرد و باعث افزایش ۴۵٪ در عضویت شد.</p>
                    <p class="mb-6">باشگاه رویال اقدسیه نه تنها یک طراحی برند بود، بلکه یک تجربه کامل بود. این پروژه به ما نشان داد که چگونه می‌توان با طراحی هویت بصری قوی، باشگاه را به مقصدی برتر تبدیل کرد.</p>
                    <h4 class="font-black mb-3">چالش‌ها و راه‌حل‌ها</h4>
                    <p class="mb-4">یکی از بزرگ‌ترین چالش‌ها، ایجاد یک هویت بصری بود که هم لوکس باشد و هم ورزشی. ما با طراحی یک استایل که هم انرژی ورزشی را منتقل می‌کرد و هم حس لوکس بودن را داشت، این مشکل را حل کردیم.</p>
                    <p class="mb-6">چالش دیگر، ایجاد یک هویت بصری بود که هم برای رسانه‌های سنتی و هم برای رسانه‌های دیجیتال مناسب باشد. ما با طراحی یک سیستم طراحی منعطف که در همه رسانه‌ها کار می‌کرد، این مشکل را حل کردیم.</p>
                `
            },
            {
                title: 'کولک',
                year: '۱۴۰۱',
                tags: ['طراحی'],
                content: `
                    <p class="text-xs text-gray-500 mb-4">۱۴۰۱</p>
                    <h4 class="font-black mb-3">داستان پروژه</h4>
                    <p class="mb-4">کولک در سال ۱۴۰۱ متولد شد - یک پروژه طراحی پلتفرم فروش لوازم دست‌ساز که می‌خواست به هنرمندان کمک کند تا محصولات خود را به فروش برسانند. چالش اصلی ما این بود که چگونه می‌توانیم یک پلتفرم طراحی کنیم که هم زیبایی محصولات را نمایش دهد و هم فروش را افزایش دهد.</p>
                    <p class="mb-4">ما با تمرکز بر نمایش زیبایی محصولات شروع کردیم. هر المان، از گالری محصولات تا صفحه محصول، با دقت طراحی شد تا زیبایی محصولات دست‌ساز را به بهترین شکل نمایش دهد. نتیجه این تلاش‌ها پلتفرمی بود که فروش را تا ۷۰٪ افزایش داد و بیش از ۳۰۰ هنرمند فعال و هزاران محصول منحصر به فرد را جذب کرد.</p>
                    <p class="mb-6">کولک نه تنها یک پلتفرم فروش بود، بلکه یک تجربه کامل بود. این پروژه به ما نشان داد که چگونه می‌توان با تمرکز بر نمایش زیبایی محصولات، فروش را به سطح جدیدی برد.</p>
                    <h4 class="font-black mb-3">چالش‌ها و راه‌حل‌ها</h4>
                    <p class="mb-4">یکی از بزرگ‌ترین چالش‌ها، ایجاد یک سیستم گالری بود که هم زیبایی محصولات را نمایش دهد و هم سریع باشد. ما با طراحی یک سیستم لود تصاویر بهینه و یک گالری تعاملی، این مشکل را حل کردیم.</p>
                    <p class="mb-6">چالش دیگر، ایجاد یک سیستم بود که هم برای هنرمندان و هم برای خریداران ساده باشد. ما با طراحی یک داشبورد مدیریتی قدرتمند برای هنرمندان و یک تجربه خرید ساده برای خریداران، این مشکل را حل کردیم.</p>
                `
            },
            {
                title: 'درسو',
                year: '۱۴۰۱',
                tags: ['طراحی'],
                content: `
                    <p class="text-xs text-gray-500 mb-4">۱۴۰۱</p>
                    <h4 class="font-black mb-3">داستان پروژه</h4>
                    <p class="mb-4">درسو در سال ۱۴۰۱ متولد شد - یک پلتفرم آموزش آنلاین که می‌خواست یادگیری را آسان و لذت‌بخش کند. چالش اصلی ما این بود که چگونه می‌توانیم یک پلتفرم طراحی کنیم که هم برای دانشجویان و هم برای اساتید مناسب باشد.</p>
                    <p class="mb-4">ما با طراحی یک رابط کاربری مدرن و تجربه کاربری بی‌نقص شروع کردیم. هر المان، از صفحه دوره تا سیستم پخش ویدیو، با دقت طراحی شد تا بهترین تجربه ممکن را برای کاربران فراهم کند. نتیجه این تلاش‌ها پلتفرمی بود که بیش از ۵۰ هزار دانشجو فعال و ۲۰۰+ دوره آموزشی را جذب کرد و هر روز در حال رشد است.</p>
                    <p class="mb-6">درسو نه تنها یک پلتفرم آموزش بود، بلکه یک تجربه کامل بود. این پروژه به ما نشان داد که چگونه می‌توان با طراحی رابط کاربری قوی، یادگیری را به سطح جدیدی برد.</p>
                    <h4 class="font-black mb-3">چالش‌ها و راه‌حل‌ها</h4>
                    <p class="mb-4">یکی از بزرگ‌ترین چالش‌ها، ایجاد یک سیستم پخش ویدیو بود که هم با کیفیت باشد و هم سریع. ما با طراحی یک سیستم استریمینگ بهینه و یک سیستم کش هوشمند، این مشکل را حل کردیم.</p>
                    <p class="mb-6">چالش دیگر، ایجاد یک سیستم بود که هم برای دانشجویان و هم برای اساتید ساده باشد. ما با طراحی یک داشبورد مدیریتی قدرتمند برای اساتید و یک تجربه یادگیری ساده برای دانشجویان، این مشکل را حل کردیم.</p>
                `
            },
            {
                title: 'راورو',
                year: '۱۴۰۲',
                tags: ['طراحی', 'برنامه‌نویسی'],
                content: `
                    <p class="text-xs text-gray-500 mb-4">۱۴۰۲</p>
                    <h4 class="font-black mb-3">داستان پروژه</h4>
                    <p class="mb-4">راورو در سال ۱۴۰۲ متولد شد - یک پلتفرم باگ بانتی که می‌خواست امنیت سایبری را به سطح جدیدی ببرد. چالش اصلی ما این بود که چگونه می‌توانیم یک پلتفرم طراحی کنیم که هم برای شرکت‌ها و هم برای هکرهای اخلاقی ساده و قدرتمند باشد.</p>
                    <p class="mb-4">ما از صفر شروع کردیم: طراحی رابط کاربری که هم زیبا باشد و هم کاربردی، برنامه‌نویسی یک سیستم امنیتی که بتواند باگ‌ها را به صورت Real-time ردیابی کند و یک سیستم پرداخت که به هکرهای اخلاقی اجازه دهد به راحتی پاداش خود را دریافت کنند.</p>
                    <p class="mb-4">نتیجه این تلاش‌ها پلتفرمی بود که بیش از ۵۰ شرکت بزرگ را جذب کرد و بیش از ۱۰۰۰ باگ امنیتی کشف شد. این موفقیت نشان داد که وقتی طراحی، برنامه‌نویسی و امنیت در کنار هم قرار می‌گیرند، می‌توانند تجربه‌ای خلق کنند که هم برای شرکت‌ها و هم برای هکرهای اخلاقی ارزشمند است.</p>
                    <p class="mb-6">راورو نه تنها یک پلتفرم باگ بانتی بود، بلکه یک راهکار کامل برای امنیت سایبری بود. این پروژه به ما نشان داد که چگونه می‌توان با ترکیب طراحی، برنامه‌نویسی و امنیت، محصولی خلق کرد که واقعاً به کاربران کمک می‌کند و آن‌ها را به بازگشت دوباره ترغیب می‌کند.</p>
                    <h4 class="font-black mb-3">چالش‌ها و راه‌حل‌ها</h4>
                    <p class="mb-4">یکی از بزرگ‌ترین چالش‌ها، ایجاد یک سیستم امنیتی بود که بتواند باگ‌ها را به صورت Real-time ردیابی کند و به شرکت‌ها اجازه دهد به سرعت از وجود باگ‌ها مطلع شوند. ما با طراحی یک سیستم مانیتورینگ پیشرفته که از هوش مصنوعی استفاده می‌کرد، این مشکل را حل کردیم.</p>
                    <p class="mb-4">چالش دیگر، ایجاد یک سیستم پرداخت بود که هم برای شرکت‌ها و هم برای هکرهای اخلاقی ساده باشد. ما با طراحی یک سیستم پرداخت خودکار که به هکرهای اخلاقی اجازه می‌داد به راحتی پاداش خود را دریافت کنند، این مشکل را حل کردیم.</p>
                    <p class="mb-6">چالش سوم، ایجاد اعتماد در شرکت‌ها بود. ما با طراحی یک سیستم امتیازدهی و نظرات شفاف، به شرکت‌ها کمک کردیم تا با اطمینان از خدمات ما استفاده کنند. این رویکرد باعث شد راورو به یکی از معتبرترین پلتفرم‌های باگ بانتی تبدیل شود.</p>
                `
            }
        ],

        open(index, event = null) {
            console.log('projectModals.open called with index:', index);
            
            const modal = document.getElementById('project-modal');
            const modalContent = document.getElementById('project-modal-content-wrapper');
            const title = document.getElementById('project-modal-title');
            const content = document.getElementById('project-modal-content');
            
            console.log('Modal elements:', { modal: !!modal, modalContent: !!modalContent, title: !!title, content: !!content });
            
            if (!modal) {
                console.error('Modal not found!');
                return;
            }
            if (!modalContent) {
                console.error('Modal content not found!');
                return;
            }
            if (!title) {
                console.error('Modal title not found!');
                return;
            }
            if (!content) {
                console.error('Modal content div not found!');
                return;
            }
            if (!this.projects[index]) {
                console.error('Project not found at index:', index, 'Available projects:', this.projects.length);
                return;
            }

            console.log('Opening modal for project:', index, this.projects[index].title);

            // Set content
            title.textContent = this.projects[index].title;
            content.innerHTML = this.projects[index].content;

            // Show modal immediately
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';

            // Reset transform - start from center, scale 0
            modalContent.style.transition = 'none';
            modalContent.style.transform = 'translate(-50%, -50%) scale(0)';
            modalContent.style.opacity = '0';

            // Force reflow
            void modalContent.offsetWidth;
            void modal.offsetWidth;

            // Animate from center
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    modalContent.style.transition = 'transform 0.4s ease-out, opacity 0.3s ease-out';
                    modalContent.style.transform = 'translate(-50%, -50%) scale(1)';
                    modalContent.style.opacity = '1';
                });
            });
        },

        close() {
            const modal = document.getElementById('project-modal');
            const modalContent = document.getElementById('project-modal-content-wrapper');
            
            if (!modal || !modalContent) return;

            // Animate out
            modalContent.style.transition = 'transform 0.3s ease-in, opacity 0.2s ease-in';
            modalContent.style.transform = 'translate(-50%, -50%) scale(0.8)';
            modalContent.style.opacity = '0';
            
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
                modalContent.style.transform = 'translate(-50%, -50%) scale(0)';
                modalContent.style.opacity = '0';
            }, 300);
        }
    };
    
    // Expose projectModals to window for external access
    window._projectModals = projectModals;
    
    // Also expose openProjectModal immediately inside IIFE
    window.openProjectModal = function(index, event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        console.log('openProjectModal called (inside IIFE) with index:', index);
        
        const modal = document.getElementById('project-modal');
        const modalContent = document.getElementById('project-modal-content-wrapper');
        const title = document.getElementById('project-modal-title');
        const content = document.getElementById('project-modal-content');
        
        if (!modal || !modalContent || !title || !content) {
            console.error('Modal elements not found!');
            return;
        }
        
        if (!projectModals.projects || !projectModals.projects[index]) {
            console.error('Project not found at index:', index);
            return;
        }
        
        const projectData = projectModals.projects[index];
        console.log('Opening modal for:', projectData.title);
        
        title.textContent = projectData.title;
        content.innerHTML = projectData.content;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        modalContent.style.transition = 'none';
        modalContent.style.transform = 'translate(-50%, -50%) scale(0)';
        modalContent.style.opacity = '0';
        
        void modalContent.offsetWidth;
        
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                modalContent.style.transition = 'transform 0.4s ease-out, opacity 0.3s ease-out';
                modalContent.style.transform = 'translate(-50%, -50%) scale(1)';
                modalContent.style.opacity = '1';
            });
        });
    };
    
    window.closeProjectModal = function() {
        const modal = document.getElementById('project-modal');
        const modalContent = document.getElementById('project-modal-content-wrapper');
        
        if (!modal || !modalContent) return;
        
        modalContent.style.transition = 'transform 0.3s ease-in, opacity 0.2s ease-in';
        modalContent.style.transform = 'translate(-50%, -50%) scale(0.8)';
        modalContent.style.opacity = '0';
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            modalContent.style.transform = 'translate(-50%, -50%) scale(0)';
            modalContent.style.opacity = '0';
        }, 300);
    };
    
    // Test if function is accessible
    console.log('window.openProjectModal defined:', typeof window.openProjectModal);

    // ========== Services Dropdown ==========
    const servicesData = [
        {
            title: 'Experience Design',
            description: 'مهندسی تجربه کاربری و رابط‌های تعاملی سازمانی با تمرکز بر طراحی سیستم‌های Enterprise.',
            items: ['Enterprise Design Systems', 'Micro-frontend Architecture', 'Cross-platform Solutions']
        },
        {
            title: 'Systems Architecture',
            description: 'طراحی معماری‌های مقیاس‌پذیر و High-Availability برای سیستم‌های سازمانی.',
            items: ['Scalable Solutions', 'Legacy Modernization', 'Cloud Native Design']
        },
        {
            title: 'Infrastructure & Ops',
            description: 'تامین زیرساخت‌های حیاتی و عملیات ابری با تمرکز بر Zero-Downtime.',
            items: ['CI/CD Pipelines', 'Containerization', 'Security Operations']
        },
        {
            title: 'Data & API Services',
            description: 'یکپارچه‌سازی سرویس‌ها و مدیریت تبادلات داده امن در مقیاس سازمانی.',
            items: ['API Design & Development', 'Data Integration', 'Service Mesh']
        },
        {
            title: 'Quality Assurance',
            description: 'تضمین کیفیت با استفاده از Automated Testing و Visual Intelligence.',
            items: ['Visual Intelligence', 'E2E Validation', 'Performance Testing']
        },
        {
            title: 'Technical Strategy',
            description: 'تدوین استانداردها، مستندسازی معماری و نقشه راه فنی برای سازمان‌ها.',
            items: ['Technical Documentation', 'Architecture Roadmap', 'Best Practices']
        }
    ];

    let currentServiceIndex = null;

    window.toggleService = function(index) {
        const serviceCards = utils.$$('.service-item');
        
        if (!serviceCards || serviceCards.length === 0) return;
        
        // If clicking the same service, deselect it
        if (currentServiceIndex === index) {
            currentServiceIndex = null;
            serviceCards.forEach(card => {
                card.classList.remove('bg-black', 'dark:bg-gray-100', 'border-black', 'dark:border-gray-100');
                card.classList.add('bg-white', 'dark:bg-gray-800', 'border-gray-200', 'dark:border-gray-700');
                const title = card.querySelector('h3');
                const text = card.querySelectorAll('p, li');
                if (title) title.classList.remove('text-white', 'dark:text-gray-900');
                if (title) title.classList.add('text-black', 'dark:text-gray-100');
                text.forEach(el => {
                    el.classList.remove('text-white', 'dark:text-gray-900');
                    el.classList.add('text-gray-600', 'dark:text-gray-400');
                });
            });
            return;
        }
        
        // Update current service
        currentServiceIndex = index;
        
        // Update card styles
        serviceCards.forEach((card, i) => {
            const title = card.querySelector('h3');
            const text = card.querySelectorAll('p, li');
            
            if (i === index) {
                card.classList.remove('bg-white', 'dark:bg-gray-800', 'border-gray-200', 'dark:border-gray-700');
                card.classList.add('bg-black', 'dark:bg-gray-100', 'border-black', 'dark:border-gray-100');
                if (title) {
                    title.classList.remove('text-black', 'dark:text-gray-100');
                    title.classList.add('text-white', 'dark:text-gray-900');
                }
                text.forEach(el => {
                    el.classList.remove('text-gray-600', 'dark:text-gray-400', 'text-gray-500');
                    el.classList.add('text-white', 'dark:text-gray-900');
                });
            } else {
                card.classList.remove('bg-black', 'dark:bg-gray-100', 'border-black', 'dark:border-gray-100');
                card.classList.add('bg-white', 'dark:bg-gray-800', 'border-gray-200', 'dark:border-gray-700');
                if (title) {
                    title.classList.remove('text-white', 'dark:text-gray-900');
                    title.classList.add('text-black', 'dark:text-gray-100');
                }
                text.forEach(el => {
                    el.classList.remove('text-white', 'dark:text-gray-900');
                    if (el.tagName === 'P') {
                        el.classList.add('text-gray-600', 'dark:text-gray-400');
                    } else {
                        el.classList.add('text-gray-500', 'dark:text-gray-500');
                    }
                });
            }
        });
    };

    // Close modals on background click
    document.addEventListener('click', (e) => {
        const privacyModal = utils.$('#privacy-modal');
        const termsModal = utils.$('#terms-modal');
        const projectModal = utils.$('#project-modal');
        
        if (privacyModal && e.target === privacyModal) {
            closePrivacyModal();
        }
        if (termsModal && e.target === termsModal) {
            closeTermsModal();
        }
        if (projectModal && e.target === projectModal) {
            closeProjectModal();
        }
    });

    // Listen for system theme changes - Disabled for light mode only
    // window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    //     if (darkMode.currentTheme === 'system') {
    //         darkMode.setTheme('system');
    //     }
    // });

    // ========== Scroll Indicators Module ==========
    const scrollIndicators = {
        init() {
            const scrollContainers = utils.$$('.scroll-container');
            
            scrollContainers.forEach(container => {
                const parent = container.closest('.relative');
                if (!parent) return;
                
                const rightGradient = parent.querySelector('.bg-gradient-to-l');
                const leftGradient = parent.querySelector('.bg-gradient-to-r');
                
                const updateIndicators = () => {
                    const { scrollLeft, scrollWidth, clientWidth } = container;
                    const isScrollable = scrollWidth > clientWidth;
                    
                    if (!isScrollable) {
                        if (rightGradient) rightGradient.style.opacity = '0';
                        if (leftGradient) leftGradient.style.opacity = '0';
                        return;
                    }
                    
                    // Right gradient (start) - show when not at start
                    if (rightGradient) {
                        rightGradient.style.opacity = scrollLeft > 10 ? '1' : '0';
                    }
                    
                    // Left gradient (end) - show when not at end
                    if (leftGradient) {
                        const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 10;
                        leftGradient.style.opacity = isAtEnd ? '0' : '1';
                    }
                };
                
                container.addEventListener('scroll', updateIndicators, { passive: true });
                window.addEventListener('resize', updateIndicators, { passive: true });
                updateIndicators();
            });
        }
    };

    // ========== Smooth Scroll ==========
    const smoothScroll = {
        init() {
            utils.$$('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = anchor.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = utils.$(targetId);
                    if (targetElement) {
                        const offset = 80;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - offset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }
    };

    // ========== Timeline Animations ==========
    const timelineAnimations = {
        init() {
            const timelineItems = utils.$$('.timeline-item');
            if (timelineItems.length === 0) return;

            // Show all items immediately - no animation needed
            // Items are already visible in HTML, so we just ensure they stay visible
            timelineItems.forEach(item => {
                item.classList.remove('opacity-0', 'translate-y-8');
                item.classList.add('opacity-100', 'translate-y-0');
            });
        }
    };

    // ========== Theme Toggle Module ==========
    const themeToggle = {
        init() {
            const toggleBtn = utils.$('#theme-toggle');
            if (!toggleBtn) {
                console.log('Theme toggle button not found');
                return;
            }
            
            const lightIcon = utils.$('#theme-icon-light');
            const darkIcon = utils.$('#theme-icon-dark');
            
            // Get current theme from localStorage or default to light
            const currentTheme = localStorage.getItem('theme') || 'light';
            const isDark = currentTheme === 'dark';
            
            if (isDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            
            this.updateIcons(isDark, lightIcon, darkIcon);
            
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const isCurrentlyDark = document.documentElement.classList.contains('dark');
                
                if (isCurrentlyDark) {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('theme', 'light');
                    this.updateIcons(false, lightIcon, darkIcon);
                } else {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('theme', 'dark');
                    this.updateIcons(true, lightIcon, darkIcon);
                }
            });
        },
        
        updateIcons(isDark, lightIcon, darkIcon) {
            if (lightIcon && darkIcon) {
                if (isDark) {
                    lightIcon.classList.add('hidden');
                    darkIcon.classList.remove('hidden');
                } else {
                    lightIcon.classList.remove('hidden');
                    darkIcon.classList.add('hidden');
                }
            }
        }
    };

    // ========== Testimonials Auto-Scroll Module ==========
    const testimonialsScroll = {
        init() {
            const scrollContainer = utils.$('#testimonials-scroll');
            if (!scrollContainer) return;
            
            // Clone all cards for infinite scroll
            const cards = scrollContainer.querySelectorAll('.testimonial-card');
            cards.forEach(card => {
                const clone = card.cloneNode(true);
                scrollContainer.appendChild(clone);
            });
        }
    };

    // ========== Language Toggle Module ==========
    const languageToggle = {
        currentLang: 'fa',
        
        init() {
            const toggleBtn = utils.$('#lang-toggle');
            if (!toggleBtn) {
                console.log('Language toggle button not found');
                return;
            }
            
            // Get current language from localStorage or default to fa
            this.currentLang = localStorage.getItem('language') || 'fa';
            this.updateButton(toggleBtn);
            
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                this.currentLang = this.currentLang === 'fa' ? 'en' : 'fa';
                localStorage.setItem('language', this.currentLang);
                this.updateButton(toggleBtn);
                // Here you can add language switching logic
                // For now, we just toggle the button text
            });
        },
        
        updateButton(btn) {
            if (btn) {
                btn.textContent = this.currentLang === 'fa' ? 'En' : 'فا';
            }
        }
    };

    // ========== Global Functions ==========
    window.toggleDarkMode = function() {
        // Disabled - always force light mode
        darkMode.setTheme('light');
    };

    window.toggleMobileMenu = function() {
        mobileMenu.toggle();
    };

    // ========== Initialization ==========
    function init() {
        try {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initializeApp);
             } else {
                initializeApp();
            }
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    }

    function initializeApp() {
        try {
            // Initialize theme and language toggles first
            themeToggle.init();
            languageToggle.init();
            
            // Then initialize other modules
            darkMode.init();
            mobileMenu.init();
            logoAnimation.init();
            activeSection.init();
            scrollAnimations.init();
            smoothScroll.init();
            consultationForm.init();
            parallaxShapes.init();
            scrollIndicators.init();
            timelineAnimations.init();
            testimonialsScroll.init();
            
            // Add event listeners to project cards
            const projectButtons = document.querySelectorAll('button[onclick^="openProjectModal"]');
            console.log('Found project buttons:', projectButtons.length);
            projectButtons.forEach((button, index) => {
                button.addEventListener('click', function(e) {
                    console.log('Button clicked via addEventListener, index:', index);
                    e.preventDefault();
                    e.stopPropagation();
                    if (window.openProjectModal) {
                        window.openProjectModal(index, e);
                    } else {
                        console.error('window.openProjectModal is not defined!');
                    }
                });
            });
            
            console.log('Baghaei Tech Group - Application initialized');
        } catch (error) {
            console.error('Error initializing application:', error);
        }
    }

    // ========== Job Application Modal ==========
    window.openJobApplicationModal = function(position = '') {
        const modal = utils.$('#job-application-modal');
        const modalContent = utils.$('#job-application-modal-content-wrapper');
        const positionInput = utils.$('#job-position');
        
        if (!modal || !modalContent) {
            console.error('Job application modal elements not found!');
            return;
        }
        
        if (positionInput && position) {
            positionInput.value = position;
        }
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        
        modalContent.style.transition = 'none';
        modalContent.style.transform = 'scale(0.9)';
        modalContent.style.opacity = '0';
        
        void modalContent.offsetWidth;
        
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                modalContent.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-out';
                modalContent.style.transform = 'scale(1)';
                modalContent.style.opacity = '1';
            });
        });
    };
    
    window.closeJobApplicationModal = function() {
        const modal = utils.$('#job-application-modal');
        const modalContent = utils.$('#job-application-modal-content-wrapper');
        
        if (!modal || !modalContent) return;
        
        modalContent.style.transition = 'transform 0.2s ease-in, opacity 0.2s ease-in';
        modalContent.style.transform = 'scale(0.95)';
        modalContent.style.opacity = '0';
        
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.style.overflow = '';
            modalContent.style.transform = 'scale(0.9)';
            modalContent.style.opacity = '0';
            
            // Reset form
            const form = utils.$('#job-application-form');
            if (form) form.reset();
            
            const messageDiv = utils.$('#job-application-message');
            if (messageDiv) messageDiv.textContent = '';
        }, 200);
    };
    
    // ========== Job Application Form Handler ==========
    const jobApplicationForm = {
        init() {
            const form = utils.$('#job-application-form');
            if (!form) return;
            
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit(form);
            });
        },
        
        async handleSubmit(form) {
            const messageDiv = utils.$('#job-application-message');
            const submitBtn = form.querySelector('button[type="submit"]');
            
            // Validate file size
            const resumeInput = utils.$('#job-resume');
            if (resumeInput && resumeInput.files.length > 0) {
                const file = resumeInput.files[0];
                const maxSize = 5 * 1024 * 1024; // 5MB
                if (file.size > maxSize) {
                    this.showMessage('حجم فایل رزومه نباید بیشتر از 5MB باشد', 'error', messageDiv);
                    return;
                }
            }
            
            // Disable submit button
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'در حال ارسال...';
            }
            
            const formData = new FormData(form);
            
            try {
                // Here you would send the data to your backend
                // For now, we'll just show a success message
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
                
                this.showMessage('درخواست شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.', 'success', messageDiv);
                
                // Reset form after 2 seconds
                setTimeout(() => {
                    form.reset();
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'ارسال درخواست';
                    }
                    window.closeJobApplicationModal();
                }, 2000);
            } catch (error) {
                this.showMessage('خطا در ارسال درخواست. لطفا دوباره تلاش کنید.', 'error', messageDiv);
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'ارسال درخواست';
                }
            }
        },
        
        showMessage(text, type, element) {
            if (!element) return;
            
            element.textContent = text;
            element.className = `text-sm font-sans ${type === 'success' ? 'text-green-600' : 'text-red-600'}`;
            
            setTimeout(() => {
                element.textContent = '';
            }, 5000);
        }
    };
    
    // Initialize job application form
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            jobApplicationForm.init();
        });
    } else {
        jobApplicationForm.init();
    }

    init();

})();

// Functions are now defined inside IIFE above

