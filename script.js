let globalValue = 0; // Единое хранимое число в десятичной системе

        // Конфигурация счетчиков (база, количество разрядов, ID контейнера, ID инпута)
        const countersConfig = [
            { id: 'hex-counter', inputId: 'hex-input', base: 16, digits: 4 },
            { id: 'dec-counter', inputId: 'dec-input', base: 10, digits: 6 },
            { id: 'oct-counter', inputId: 'oct-input', base: 8, digits: 6 },
            { id: 'bin-counter', inputId: 'bin-input', base: 2, digits: 12 }
        ];

        // Инициализация структуры элементов для каждого счетчика
        function initCounters() {
            countersConfig.forEach(config => {
                const container = document.getElementById(config.id);
                container.innerHTML = '';

                for (let i = 0; i < config.digits; i++) {
                    const drum = document.createElement('div');
                    drum.className = 'digit-drum';
                    
                    const track = document.createElement('div');
                    track.className = 'digit-track';
                    track.id = `${config.id}-digit-${i}`;

                    // Генерируем вертикальную ленту цифр от 0 до base-1
                    let digitsHTML = '';
                    for (let d = 0; d < config.base; d++) {
                        digitsHTML += `<div class="digit">${d.toString(16).toUpperCase()}</div>`;
                    }
                    track.innerHTML = digitsHTML;
                    
                    drum.appendChild(track);
                    container.appendChild(drum);
                }

                // Навешиваем обработчик ввода на текстовое поле
                const inputEl = document.getElementById(config.inputId);
                inputEl.addEventListener('input', () => handleInputChange(config, inputEl));
            });
        }

        // Обновление отображения всех счетчиков и полей ввода на основе globalValue
        function updateAllViews(sourceInputId = null) {
            countersConfig.forEach(config => {
                let strValue = globalValue.toString(config.base).toUpperCase();
                strValue = strValue.padStart(config.digits, '0');

                // Если число превышает максимальную разрядность счетчика, ограничиваем его
                const maxVal = Math.pow(config.base, config.digits) - 1;
                if (globalValue > maxVal) {
                    globalValue = maxVal;
                    strValue = globalValue.toString(config.base).toUpperCase().padStart(config.digits, '0');
                }

                // Обновляем визуальные барабаны (эффект сдвига)
                for (let i = 0; i < config.digits; i++) {
                    const digitChar = strValue[i];
                    const track = document.getElementById(`${config.id}-digit-${i}`);
                    if (track) {
                        const digitIndex = parseInt(digitChar, config.base);
                        track.style.transform = `translateY(-${digitIndex * 44}px)`;
                    }
                }

                // Обновляем текст в поле ввода, если это поле сейчас не находится в фокусе редактирования пользователем
                const inputEl = document.getElementById(config.inputId);
                if (document.activeElement !== inputEl) {
                    inputEl.value = strValue;
                }
            });
        }

        // Обработка ручного ввода пользователя в одном из полей
        function handleInputChange(config, inputEl) {
            let valStr = inputEl.value.trim().toUpperCase();

            // Если поле пустое, сбрасываем в 0
            if (valStr === '') {
                globalValue = 0;
                updateAllViews();
                return;
            }

            // Проверяем валидность введенных символов для данной системы счисления
            const regexMap = {
                16: /^[0-9A-F]+$/,                 10: /^[0-9]+$/,
                8: /^[0-7]+$/,                 2: /^[01]+$/
            };

            if (regexMap[config.base].test(valStr)) {
                let parsed = parseInt(valStr, config.base);
                if (!isNaN(parsed)) {
                    globalValue = parsed;
                    updateAllViews();
                }
            }
        }

        // Запуск при загрузке страницы (устанавливаем начальное значение 0)
        initCounters();
        updateAllViews();