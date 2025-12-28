const searchInput = document.querySelector('input');
const searchBtn = document.querySelector('button');

async function getWeatherData(city) {
    if (!city) return;

    try {
        // 1. Şehrin koordinatlarını (Enlem/Boylam) bulma
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=tr&format=json`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.results) {
            alert("Şehir bulunamadı, lütfen tekrar deneyin!");
            return;
        }

        const { latitude, longitude, name } = geoData.results[0];

        // 2. Koordinatlara göre hava durumunu çekme
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        updateUI(weatherData.current_weather, name);

    } catch (error) {
        console.error("Veri çekme hatası:", error);
    }
}

function updateUI(data, cityName) {
    // Şehir ismi ve Sıcaklık
    document.querySelector('.city-name').textContent = cityName;
    document.querySelector('.temp').textContent = `${Math.round(data.temperature)}°C`;
    document.querySelector('.wind-speed').textContent = `${data.windspeed} km/s`;
    
    // Rüzgar yönü için basit bir gösterge (WMO kodu yerine yön)
    document.querySelector('.wind-direction').textContent = `${data.winddirection}°`;

    // Hava Durumu İkonu Değiştirme (WMO Kodlarına Göre)
    const icon = document.querySelector('.weather-icon');
    const code = data.weathercode;

    // Basit eşleştirme: 0=Açık, 1-3=Parçalı, 51+=Yağış
    if (code === 0) icon.src = "https://cdn-icons-png.flaticon.com/512/869/869869.png";
    else if (code <= 3) icon.src = "https://cdn-icons-png.flaticon.com/512/1163/1163624.png";
    else if (code >= 51) icon.src = "https://cdn-icons-png.flaticon.com/512/1163/1163657.png";
    else icon.src = "https://cdn-icons-png.flaticon.com/512/4005/4005901.png";
}

// Tetikleyiciler
searchBtn.addEventListener('click', () => getWeatherData(searchInput.value));
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') getWeatherData(searchInput.value);
});
