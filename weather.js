// Hava Durumu Uygulaması
// Open-Meteo API kullanır (Ücretsiz, API key gerektirmez)

class WeatherApp {
    constructor() {
        this.geocodingUrl = 'https://geocoding-api.open-meteo.com/v1/search';
        this.weatherUrl = 'https://api.open-meteo.com/v1/forecast';
        this.reverseGeocodingUrl = 'https://nominatim.openstreetmap.org/reverse';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDefaultCity();
    }

    setupEventListeners() {
        // Arama butonu
        document.getElementById('search-btn').addEventListener('click', () => {
            this.searchWeather();
        });

        // Enter tuşu ile arama
        document.getElementById('city-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchWeather();
            }
        });

        // Konum butonu
        document.getElementById('location-btn').addEventListener('click', () => {
            this.getLocationWeather();
        });
    }

    async searchWeather() {
        const city = document.getElementById('city-input').value.trim();
        if (!city) {
            this.showError('Lütfen bir şehir adı girin!');
            return;
        }

        this.showLoading();

        try {
            // Önce şehir koordinatlarını al
            const geocodeResponse = await fetch(
                `${this.geocodingUrl}?name=${encodeURIComponent(city)}&count=1&language=tr&format=json`
            );

            if (!geocodeResponse.ok) {
                throw new Error('Şehir bulunamadı!');
            }

            const geocodeData = await geocodeResponse.json();
            
            if (!geocodeData.results || geocodeData.results.length === 0) {
                throw new Error('Şehir bulunamadı!');
            }

            const location = geocodeData.results[0];
            await this.fetchWeatherByCoords(location.latitude, location.longitude, location.name);
        } catch (error) {
            this.showError(error.message);
        }
    }

    async getLocationWeather() {
        if (!navigator.geolocation) {
            this.showError('Tarayıcınız konum özelliğini desteklemiyor!');
            return;
        }

        this.showLoading();

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                // Koordinatlardan şehir adını al (Nominatim reverse geocoding)
                let cityName = 'Konumunuz';
                try {
                    const reverseResponse = await fetch(
                        `${this.reverseGeocodingUrl}?lat=${lat}&lon=${lon}&format=json&accept-language=tr`
                    );
                    if (reverseResponse.ok) {
                        const reverseData = await reverseResponse.json();
                        cityName = reverseData.address?.city 
                            || reverseData.address?.town 
                            || reverseData.address?.village 
                            || reverseData.address?.municipality
                            || 'Konumunuz';
                    }
                } catch (error) {
                    console.log('Reverse geocoding başarısız, varsayılan isim kullanılıyor');
                }
                
                await this.fetchWeatherByCoords(lat, lon, cityName);
            },
            (error) => {
                this.showError('Konum alınamadı: ' + error.message);
            }
        );
    }

    async fetchWeatherByCoords(lat, lon, cityName) {
        try {
            // Hava durumu verilerini al
            const weatherResponse = await fetch(
                `${this.weatherUrl}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,pressure_msl,visibility&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`
            );

            if (!weatherResponse.ok) {
                throw new Error('Hava durumu bilgisi alınamadı!');
            }

            const weatherData = await weatherResponse.json();
            this.displayWeather(weatherData, cityName, lat, lon);
        } catch (error) {
            this.showError(error.message);
        }
    }

    displayWeather(data, cityName, lat, lon) {
        this.hideLoading();
        this.hideError();

        const current = data.current;
        const daily = data.daily;

        // Şehir bilgisi
        document.getElementById('city-name').textContent = cityName;
        
        // Tarih ve saat
        const date = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        document.getElementById('date-time').textContent = date.toLocaleDateString('tr-TR', options);

        // Sıcaklık
        const temp = Math.round(current.temperature_2m);
        document.getElementById('temp-value').textContent = temp;
        
        // Hissedilen sıcaklık (wind chill hesaplama)
        const feelsLike = this.calculateFeelsLike(current.temperature_2m, current.wind_speed_10m, current.relative_humidity_2m);
        document.getElementById('feels-like-temp').textContent = Math.round(feelsLike);

        // Hava durumu açıklaması
        const weatherDesc = this.getWeatherDescription(current.weather_code);
        document.getElementById('weather-desc').textContent = weatherDesc;

        // İkon
        this.setWeatherIcon(current.weather_code);

        // Detaylar
        document.getElementById('humidity').textContent = Math.round(current.relative_humidity_2m) + '%';
        document.getElementById('wind-speed').textContent = Math.round(current.wind_speed_10m * 3.6) + ' km/h';
        document.getElementById('pressure').textContent = Math.round(current.pressure_msl) + ' hPa';
        const visibility = current.visibility ? (current.visibility / 1000).toFixed(1) : 'N/A';
        document.getElementById('visibility').textContent = visibility + ' km';

        // Görünürlüğü ayarla
        document.getElementById('current-weather').style.display = 'block';

        // 5 günlük tahmin
        this.displayForecast(daily);

        // Arama kutusuna şehir adını yaz
        document.getElementById('city-input').value = cityName;
    }

    calculateFeelsLike(temp, windSpeed, humidity) {
        // Basit wind chill ve heat index kombinasyonu
        let feelsLike = temp;
        
        // Soğuk rüzgar faktörü (sıcaklık düşükse)
        if (temp < 10 && windSpeed > 0) {
            const windChill = 13.12 + 0.6215 * temp - 11.37 * Math.pow(windSpeed * 3.6, 0.16) + 0.3965 * temp * Math.pow(windSpeed * 3.6, 0.16);
            feelsLike = windChill;
        }
        
        // Yüksek nem faktörü (sıcaklık yüksekse)
        if (temp > 27 && humidity > 40) {
            const heatIndex = -8.78469475556 + 1.61139411 * temp + 2.33854883889 * humidity 
                - 0.14611605 * temp * humidity - 0.012308094 * Math.pow(temp, 2) 
                - 0.0164248277778 * Math.pow(humidity, 2) + 0.002211732 * Math.pow(temp, 2) * humidity 
                + 0.00072546 * temp * Math.pow(humidity, 2) - 0.000003582 * Math.pow(temp, 2) * Math.pow(humidity, 2);
            if (heatIndex > temp) {
                feelsLike = heatIndex;
            }
        }
        
        return feelsLike;
    }

    getWeatherDescription(code) {
        // WMO Weather interpretation codes
        const descriptions = {
            0: 'Açık gökyüzü',
            1: 'Çoğunlukla açık',
            2: 'Kısmen bulutlu',
            3: 'Kapalı',
            45: 'Sisli',
            48: 'Yoğun sisli',
            51: 'Hafif çiseleme',
            53: 'Orta çiseleme',
            55: 'Yoğun çiseleme',
            56: 'Hafif donan çiseleme',
            57: 'Yoğun donan çiseleme',
            61: 'Hafif yağmur',
            63: 'Orta yağmur',
            65: 'Yoğun yağmur',
            66: 'Donan hafif yağmur',
            67: 'Donan yoğun yağmur',
            71: 'Hafif kar',
            73: 'Orta kar',
            75: 'Yoğun kar',
            77: 'Kar taneleri',
            80: 'Hafif sağanak',
            81: 'Orta sağanak',
            82: 'Yoğun sağanak',
            85: 'Hafif kar sağanağı',
            86: 'Yoğun kar sağanağı',
            95: 'Gök gürültülü fırtına',
            96: 'Gök gürültülü fırtına dolu ile',
            99: 'Şiddetli gök gürültülü fırtına dolu ile'
        };
        return descriptions[code] || 'Bilinmeyen';
    }

    setWeatherIcon(code) {
        const iconElement = document.getElementById('weather-icon');
        let iconClass = 'fas fa-sun';
        let iconName = 'clear-day';

        // WMO Weather codes'a göre ikon seçimi
        if (code === 0) {
            iconClass = 'fas fa-sun';
            iconName = 'clear-day';
        } else if (code === 1 || code === 2) {
            iconClass = 'fas fa-cloud-sun';
            iconName = 'clouds';
        } else if (code === 3) {
            iconClass = 'fas fa-cloud';
            iconName = 'clouds';
        } else if (code >= 45 && code <= 48) {
            iconClass = 'fas fa-smog';
            iconName = 'mist';
        } else if (code >= 51 && code <= 67) {
            iconClass = 'fas fa-cloud-rain';
            iconName = 'rain';
        } else if (code >= 71 && code <= 77) {
            iconClass = 'fas fa-snowflake';
            iconName = 'snow';
        } else if (code >= 80 && code <= 86) {
            iconClass = 'fas fa-cloud-showers-heavy';
            iconName = 'rain';
        } else if (code >= 95 && code <= 99) {
            iconClass = 'fas fa-bolt';
            iconName = 'thunderstorm';
        } else {
            iconClass = 'fas fa-cloud-sun';
            iconName = 'clouds';
        }

        iconElement.innerHTML = `<i class="${iconClass}"></i>`;
        iconElement.className = `weather-icon ${iconName}`;
    }

    displayForecast(daily) {
        const forecastList = document.getElementById('forecast-list');
        forecastList.innerHTML = '';

        // 5 günlük tahmin göster
        for (let i = 0; i < Math.min(5, daily.time.length); i++) {
            const date = new Date(daily.time[i]);
            const dayName = i === 0 ? 'Bugün' : date.toLocaleDateString('tr-TR', { weekday: 'short' });
            const weatherCode = daily.weather_code[i];
            const tempMax = Math.round(daily.temperature_2m_max[i]);
            const tempMin = Math.round(daily.temperature_2m_min[i]);

            let iconClass = 'fas fa-sun';
            if (weatherCode === 0) {
                iconClass = 'fas fa-sun';
            } else if (weatherCode === 1 || weatherCode === 2) {
                iconClass = 'fas fa-cloud-sun';
            } else if (weatherCode === 3) {
                iconClass = 'fas fa-cloud';
            } else if (weatherCode >= 45 && weatherCode <= 48) {
                iconClass = 'fas fa-smog';
            } else if (weatherCode >= 51 && weatherCode <= 67) {
                iconClass = 'fas fa-cloud-rain';
            } else if (weatherCode >= 71 && weatherCode <= 77) {
                iconClass = 'fas fa-snowflake';
            } else if (weatherCode >= 80 && weatherCode <= 86) {
                iconClass = 'fas fa-cloud-showers-heavy';
            } else if (weatherCode >= 95 && weatherCode <= 99) {
                iconClass = 'fas fa-bolt';
            }

            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            
            forecastItem.innerHTML = `
                <div class="forecast-day">${dayName}</div>
                <div class="forecast-icon"><i class="${iconClass}"></i></div>
                <div class="forecast-temp">
                    <span class="forecast-temp-high">${tempMax}°</span>
                    <span class="forecast-temp-low">${tempMin}°</span>
                </div>
            `;

            forecastList.appendChild(forecastItem);
        }

        document.getElementById('forecast').style.display = 'block';
    }

    async loadDefaultCity() {
        // Varsayılan olarak İstanbul'u yükle
        try {
            const geocodeResponse = await fetch(
                `${this.geocodingUrl}?name=Istanbul&count=1&language=tr&format=json`
            );
            const geocodeData = await geocodeResponse.json();
            if (geocodeData.results && geocodeData.results.length > 0) {
                const location = geocodeData.results[0];
                await this.fetchWeatherByCoords(location.latitude, location.longitude, location.name);
            }
        } catch (error) {
            console.error('Varsayılan şehir yüklenemedi:', error);
        }
    }

    showLoading() {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('current-weather').style.display = 'none';
        document.getElementById('forecast').style.display = 'none';
        this.hideError();
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    showError(message) {
        document.getElementById('error-text').textContent = message;
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('current-weather').style.display = 'none';
        document.getElementById('forecast').style.display = 'none';
        this.hideLoading();
    }

    hideError() {
        document.getElementById('error-message').style.display = 'none';
    }

    showNotification(message, type = 'info') {
        // Basit bildirim
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#4a90e2'};
            color: white;
            border-radius: 10px;
            z-index: 2000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});

// CSS animasyonları için style ekle
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
