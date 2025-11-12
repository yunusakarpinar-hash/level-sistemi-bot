⚡ Seviye (Levelling) Botu Altyapısı - 
Bu proje, Discord sunucularınız için mesajlaşma tabanlı deneyim puanı (XP) ve seviye sistemi kurmanızı sağlayan, tamamiyle ayarlanabilir bir Discord.js altyapısıdır.
🌟 Özellikler
 * Ayarlanabilir XP Sistemi: Kazanılan XP ve seviye atlamak için gereken XP miktarları config.json üzerinden kolayca değiştirilebilir.
 * JSON Veritabanı: Hızlı ve basit kurulum için database.json dosyasını kullanır. (Büyük projeler için MongoDB'ye geçiş önerilir.)
 * Yönetici Komutları: Sistemi açma/kapatma ve seviye atlama duyurularının yapılacağı kanalı ayarlama yeteneği.
 * Kullanıcı Komutları: Kullanıcıların kendi seviyelerini ve XP durumlarını görmesini sağlayan !rank komutu.
 * Türkçe Komut ve Mesaj Yapısı: Tüm komutlar ve bot mesajları Türkçedir ve config.json ile kişiselleştirilebilir.
🛠️ Kurulum
Bu altyapıyı kullanmaya başlamak için aşağıdaki adımları takip edin:
Adım 1: Dosyaları Hazırlama
 * Bu projenin dosyalarını bilgisayarınıza indirin veya kopyalayın.
 * Proje klasörünüzde terminali açın ve gerekli kütüphaneleri yükleyin:
   npm install discord.js

Adım 2: Yapılandırma (config.json)
config.json dosyasını açın ve kendi bilgilerinizi ve ayarlarınızı girin:
| Alan | Açıklama |
|---|---|
| TOKEN | Discord botunuzun TOKEN'ini buraya yapıştırın. |
| PREFIX | Botunuzun komut ön eki (Örn: ! veya +). |
| XP_AYARLARI | XP kazanım aralığı ve seviye çarpanını ayarlayın. |

Adım 3: Botu Çalıştırma
Terminalde botunuzu başlatın:
node index.js

📜 Komutlar
Botun tüm komutları config.json dosyasında tanımlanan Ön Ek ile kullanılır (Varsayılan: !).
| Komut | Açıklama | Yetki |
|---|---|---|
| !yardim | Tüm komutların listesini ve kullanımını gösterir. | Herkes |
| !rank | Kullanıcının (veya etiketlenen kişinin) mevcut seviyesini ve XP durumunu gösterir. | Herkes |
| !seviyesistemi | Sunucuda seviye sistemini açar veya kapatır. | Yönetici |
| !seviyekanaliayarla #kanal | Seviye atlama duyurularının yapılacağı kanalı ayarlar. | Yönetici |
💡 Geliştirme İpuçları
Bu altyapı, geliştirmeniz için sağlam bir temel sunar:
 * Liderlik Tablosu: Tüm sunucudaki kullanıcıları seviye veya XP'ye göre sıralayan bir !top veya !sıralama komutu ekleyebilirsiniz.
 * Susturulan Kanallar: Bazı kanallarda (örneğin bot komut kanalları) XP verilmemesi için kontrol ekleyebilirsiniz.
 * XP Çarpanları: Belirli rollere veya kanallara özel daha fazla XP veren çarpanlar uygulayabilirsiniz.
👤 Geliştirici
Bu altyapı bexA tarafından yapilmistir.
 * Geliştirici: bexA
 * Proje Adı: Seviye Botu Altyapısı
 * Versiyon: 1.0
