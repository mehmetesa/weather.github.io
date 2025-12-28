// Script kısmındaki ikon belirleme bölümünü bu kapsamlı liste ile değiştirdim:

function setWeatherIcon(code) {
    const icon = document.getElementById('mainIcon');
    
    // WMO Hava Durumu Kodları Tam Listesi
    const iconMap = {
        // Güneşli / Açık
        0: "https://cdn-icons-png.flaticon.com/512/869/869869.png",
        
        // Parçalı Bulutlu
        1: "https://cdn-icons-png.flaticon.com/512/1163/1163661.png",
        2: "https://cdn-icons-png.flaticon.com/512/1163/1163624.png",
        3: "https://cdn-icons-png.flaticon.com/512/1163/1163624.png",
        
        // Sisli
        45: "https://cdn-icons-png.flaticon.com/512/4005/4005901.png",
        48: "https://cdn-icons-png.flaticon.com/512/4005/4005901.png",
        
        // Çiseleme / Hafif Yağmur
        51: "https://cdn-icons-png.flaticon.com/512/1163/1163657.png",
        53: "https://cdn-icons-png.flaticon.com/512/1163/1163657.png",
        55: "https://cdn-icons-png.flaticon.com/512/1163/1163657.png",
        
        // Şiddetli Yağmur / Sağanak
        61: "https://cdn-icons-png.flaticon.com/512/3351/3351979.png",
        63: "https://cdn-icons-png.flaticon.com/512/3351/3351979.png",
        65: "https://cdn-icons-png.flaticon.com/512/3351/3351979.png",
        
        // Kar Yağışı
        71: "https://cdn-icons-png.flaticon.com/512/2315/2315309.png",
        73: "https://cdn-icons-png.flaticon.com/512/2315/2315309.png",
        75: "https://cdn-icons-png.flaticon.com/512/2315/2315309.png",
        77: "https://cdn-icons-png.flaticon.com/512/2315/2315309.png",
        
        // Gök Gürültülü Fırtına
        95: "https://cdn-icons-png.flaticon.com/512/1146/1146860.png",
        96: "https://cdn-icons-png.flaticon.com/512/1146/1146860.png",
        99: "https://cdn-icons-png.flaticon.com/512/1146/1146860.png"
    };

    // Eğer kod listede varsa onu kullan, yoksa varsayılan olarak bulutlu göster
    icon.src = iconMap[code] || "https://cdn-icons-png.flaticon.com/512/1163/1163624.png";
}
