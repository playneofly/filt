# FILTERNET Android Source Files

## ساختار فایل‌ها

```
app/src/main/
├── res/
│   ├── layout/
│   │   ├── activity_main.xml          ← صفحه اصلی (MainActivity)
│   │   ├── fragment_home.xml          ← صفحه Home (دکمه اتصال + آمار)
│   │   ├── fragment_servers.xml       ← لیست سرورها
│   │   ├── fragment_stats.xml         ← آمار مصرف
│   │   ├── fragment_settings.xml      ← تنظیمات
│   │   ├── item_server.xml            ← آیتم لیست سرور
│   │   └── dialog_scanning.xml        ← دیالوگ اسکن بهترین سرور
│   ├── values/
│   │   ├── colors.xml
│   │   ├── strings.xml
│   │   └── themes.xml
│   └── drawable/
│       └── (اشکال SVG و شکل‌های ترسیمی)
├── kotlin/
│   ├── MainActivity.kt
│   ├── HomeFragment.kt
│   ├── ServersFragment.kt
│   ├── StatsFragment.kt
│   ├── SettingsFragment.kt
│   ├── ServerAdapter.kt
│   └── model/
│       └── Server.kt
```

## نحوه استفاده

1. فایل‌های `res/layout/` را در پوشه layout پروژه کپی کنید
2. فایل‌های `kotlin/` را در پوشه kotlin/java پروژه کپی کنید  
3. فایل‌های `values/` را ادغام کنید
4. Dependencies زیر را به `build.gradle` اضافه کنید:

```gradle
implementation 'com.google.android.material:material:1.11.0'
implementation 'androidx.navigation:navigation-fragment-ktx:2.7.7'
implementation 'androidx.navigation:navigation-ui-ktx:2.7.7'
implementation 'androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0'
implementation 'com.airbnb.android:lottie:6.3.0'
```
