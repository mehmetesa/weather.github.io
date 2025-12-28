# ☀️ Hava Durumu Uygulaması

**Gerçek zamanlı hava durumu bilgileri sunan modern web uygulaması.**

Ücretsiz Open-Meteo API kullanarak gerçek hava durumu verilerini gösteren, kullanıcı dostu bir hava durumu uygulaması.

## 🌟 Özellikler

- ✅ **Gerçek Zamanlı Veri** - Open-Meteo API ile anlık hava durumu bilgileri
- ✅ **Şehir Arama** - Dünya çapında herhangi bir şehir için hava durumu sorgulama
- ✅ **Konum Tabanlı** - GPS ile otomatik konum algılama ve hava durumu gösterme
- ✅ **Detaylı Bilgiler** - Sıcaklık, nem, rüzgar, basınç, görüş mesafesi
- ✅ **5 Günlük Tahmin** - Gelecek hava durumu tahminleri
- ✅ **Hissedilen Sıcaklık** - Rüzgar ve nem faktörlerini içeren hissedilen sıcaklık hesaplama
- ✅ **Modern Tasarım** - Responsive ve kullanıcı dostu arayüz
- ✅ **Ücretsiz** - API key gerektirmez, hemen kullanılabilir

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Modern web tarayıcısı (Chrome, Firefox, Edge, Safari)
- İnternet bağlantısı

### Kurulum

Kurulum gerektirmez! Sadece `weather.html` dosyasını tarayıcınızda açın:

1. `weather.html` dosyasını çift tıklayarak açın
   - Veya tarayıcınızda "Dosya > Aç" menüsünden seçin
   
2. Sayfa otomatik olarak İstanbul'un hava durumunu yükler

## 💻 Kullanım

### Şehir Arama

1. Üst kısımdaki arama kutusuna şehir adı girin (örn: "Ankara", "London", "New York")
2. Arama butonuna tıklayın veya Enter tuşuna basın
3. Hava durumu bilgileri otomatik olarak gösterilir

### Konumumu Kullan

1. 📍 Konum butonuna (harita ikonu) tıklayın
2. Tarayıcı konum izni isteyecek - "İzin Ver" butonuna tıklayın
3. Bulunduğunuz konumun hava durumu otomatik olarak gösterilir

### Gösterilen Bilgiler

- **Sıcaklık** - Mevcut hava sıcaklığı (°C)
- **Hissedilen Sıcaklık** - Rüzgar ve nem faktörlerini içeren hissedilen sıcaklık
- **Hava Durumu** - Açıklama (açık, bulutlu, yağmurlu vb.)
- **Nem** - Hava nem oranı (%)
- **Rüzgar** - Rüzgar hızı (km/h)
- **Basınç** - Atmosfer basıncı (hPa)
- **Görüş Mesafesi** - Görüş mesafesi (km)
- **5 Günlük Tahmin** - Gelecek 5 gün için sıcaklık ve hava durumu tahminleri

## 🛠️ Teknik Detaylar

### Kullanılan Teknolojiler

- **HTML5** - Yapısal markup
- **CSS3** - Modern ve responsive tasarım (gradient, animations, flexbox, grid)
- **JavaScript (ES6+)** - Dinamik içerik ve API entegrasyonu
- **Font Awesome** - İkonlar için

### API'ler

- **Open-Meteo API** - Hava durumu verileri
  - Ücretsiz
  - API key gerektirmez
  - Gerçek zamanlı veri
  - Dünya çapında kapsama

- **Nominatim (OpenStreetMap)** - Reverse geocoding (koordinatlardan şehir adı)

### Dosya Yapısı

```
├── weather.html          # Ana HTML dosyası
├── weather.js            # JavaScript mantığı ve API entegrasyonu
└── weather.css           # Stil dosyası
```

## 🎨 Özellikler Detayı

### Hava Durumu İkonları

- ☀️ Açık gökyüzü
- ⛅ Kısmen bulutlu
- ☁️ Kapalı
- 🌧️ Yağmur
- ⛈️ Fırtına
- ❄️ Kar
- 🌫️ Sis

### Responsive Tasarım

- Masaüstü, tablet ve mobil cihazlarda mükemmel görünüm
- Touch-friendly arayüz
- Esnek grid layout

## 📱 Tarayıcı Desteği

- ✅ Chrome/Edge (son 2 versiyon)
- ✅ Firefox (son 2 versiyon)
- ✅ Safari (son 2 versiyon)
- ✅ Opera (son 2 versiyon)

## 🔒 Gizlilik

- Konum bilgileri sadece hava durumu sorgulaması için kullanılır
- Hiçbir veri sunucuya kaydedilmez
- Tüm veriler tarayıcıda işlenir
- Harici API'lere sadece sorgu yapılır

## 📝 Notlar

- İnternet bağlantısı gereklidir
- İlk yükleme biraz zaman alabilir (API yanıt süresi)
- Bazı şehirler için veri bulunmayabilir (çok küçük yerleşimler)
- Konum özelliği için tarayıcı izni gereklidir

## 🤝 Katkıda Bulunma

Önerileriniz veya hata bildirimleriniz için:
- Issue açabilirsiniz
- Pull request gönderebilirsiniz

## 📄 Lisans

Bu proje açık kaynak kodludur ve eğitim amaçlıdır.

## 🔗 Faydalı Linkler

- [Open-Meteo API Dokümantasyonu](https://open-meteo.com/en/docs)
- [Nominatim Dokümantasyonu](https://nominatim.org/release-docs/develop/api/Overview/)
