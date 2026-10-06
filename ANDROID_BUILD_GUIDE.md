# Guide Complet de Construction Android pour NovaShop (Android Build Guide)

Ce guide est destiné aux développeurs Android pour compiler, packager et déployer le projet **NovaShop** sous forme d'application native Android (.apk et .aab) ou pour l'intégrer dans Android Studio.

---

## 📱 1. Spécifications du Projet Android

- **Nom de l'application** : `NovaShop`
- **Identifiant de paquet (Package ID)** : `cm.novashop.app`
- **Version actuelle** : `1.0.0` (Code de version : `100`)
- **Version minimale d'Android (minSdkVersion)** : `Android 8.0 (API 26)` ou supérieur
- **Version ciblée (targetSdkVersion)** : `Android 14 / 15 (API 34 / 35)`
- **Framework Frontend** : React 19, TypeScript, Tailwind CSS, Vite
- **Serveur Backend / API** : Node.js, Express, TypeScript (`server.ts`)
- **Intelligence Artificielle** : Google GenAI SDK (`@google/genai`) avec fallback local autonome

---

## 🛠️ 2. Prérequis pour le Développeur

Avant de commencer, assurez-vous d'avoir installé sur votre machine :
1. **Node.js** : version 20.x ou supérieure (vérifier avec `node -v`)
2. **npm** ou **bun**
3. **Android Studio** (version Jellyfish, Koala, Ladybug ou supérieure)
4. **JDK 17 ou JDK 21** (configuré dans la variable `JAVA_HOME`)
5. **Android SDK** avec Build-Tools 34.0.0+ et Android SDK Platform 34 ou 35
6. Un câble USB avec débogage USB activé sur votre smartphone Android (ou un émulateur AVD configuré)

---

## 🚀 3. Méthode Recommandée : Capacitor (Ionic / Native Android)

Capacitor est la solution standard officielle pour transformer une application web moderne React en application Android native avec accès complet aux API matérielles.

### Étape 1 : Extraire et installer les dépendances web
```bash
# Décompresser le projet
unzip novashop-complete-project.zip -d novashop
cd novashop

# Installer les dépendances
npm install
```

### Étape 2 : Compiler le frontend de production
```bash
npm run build
```
Cette commande génère le dossier `dist/` contenant tous les fichiers HTML, JS, CSS et assets optimisés.

### Étape 3 : Installer les bibliothèques Capacitor pour Android
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### Étape 4 : Initialiser le projet Android
Le fichier `capacitor.config.json` est déjà préconfiguré à la racine. Exécutez simplement :
```bash
npx cap add android
```
Cette commande génère automatiquement le dossier natif `android/` avec la structure Gradle complète :
- `android/app/src/main/AndroidManifest.xml`
- `android/app/build.gradle`
- `android/build.gradle`
- `android/app/src/main/java/cm/novashop/app/MainActivity.java`
- `android/app/src/main/res/` (icônes, styles, splash screen)

### Étape 5 : Synchroniser les assets web avec le projet Android
À chaque modification ou build du frontend :
```bash
npm run build
npx cap sync android
```

### Étape 6 : Ouvrir et compiler dans Android Studio
```bash
npx cap open android
```
Dans Android Studio :
1. Attendez la fin de la synchronisation Gradle (`Gradle sync finished`).
2. Pour tester immédiatement : sélectionnez votre appareil ou émulateur et cliquez sur **Run 'app'** (Maj + F10).
3. Pour générer un APK de test (Debug APK) :
   - Menu : **Build > Build Bundle(s) / APK(s) > Build APK(s)**
   - L'APK sera généré dans : `android/app/build/outputs/apk/debug/app-debug.apk`
4. Pour générer un AAB pour Google Play Store :
   - Menu : **Build > Generate Signed Bundle / APK**
   - Choisissez **Android App Bundle (.aab)**
   - Sélectionnez votre Keystore (ou créez-en un nouveau) et signez l'application.

### Compilation directe en ligne de commande (sans ouvrir l'interface Studio) :
```bash
cd android
./gradlew assembleDebug
# Le fichier APK est disponible dans :
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🌐 4. Configuration du Backend & API

Le projet comprend un serveur backend Express complet (`server.ts`).

### En développement local :
Pour lancer le serveur backend :
```bash
npm run dev
```
Le serveur écoute sur `http://localhost:3000`.

*Note pour les émulateurs Android :*
- Sur l'émulateur Android standard, l'adresse de votre machine hôte est `http://10.0.2.2:3000`.
- Sur un smartphone physique connecté en Wi-Fi, utilisez l'adresse IP locale de votre machine (ex: `http://192.168.1.50:3000`).

### En production (Déploiement Cloud) :
Déployez le backend sur votre hébergeur habituel (Google Cloud Run, Render, VPS, Railway, etc.) :
```bash
NODE_ENV=production npm run start
```
Puis dans le frontend ou dans `capacitor.config.json`, configurez l'URL publique de l'API :
```json
{
  "appId": "cm.novashop.app",
  "appName": "NovaShop",
  "webDir": "dist",
  "server": {
    "url": "https://api.votre-domaine.com",
    "cleartext": false
  }
}
```

---

## 📡 5. Endpoints API Disponibles pour Développeurs Natifs (REST)

Si un développeur souhaite concevoir une application 100% native en **Kotlin / Jetpack Compose**, tous les services REST sont documentés ci-dessous :

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Récupère la liste complète des produits (catégories, prix FCFA, stock, notes) |
| `GET` | `/api/products/:id` | Récupère le détail d'un produit par identifiant |
| `POST` | `/api/products` | Création d'un produit (réservé admin) |
| `PUT` | `/api/products/:id` | Mise à jour d'un produit ou du stock |
| `DELETE` | `/api/products/:id` | Suppression d'un produit |
| `GET` | `/api/orders` | Liste des commandes avec filtrage par statut |
| `POST` | `/api/orders` | Création d'une nouvelle commande (MoMo, OM, Cash) |
| `PATCH` | `/api/orders/:id/status` | Modification du statut de suivi de commande |
| `GET` | `/api/delivery-zones` | Tarifs et délais de livraison par ville (Douala, Yaoundé, etc.) |
| `GET` | `/api/payment-gateways` | Liste des passerelles actives (MTN MoMo, Orange Money, Cash) |
| `POST` | `/api/coupons/validate` | Validation d'un code promo avec calcul de réduction |
| `POST` | `/api/gemini/chat` | Chatbot IA assistant d'achat (Gemini + fallback intelligent) |
| `POST` | `/api/admin/login` | Authentification administrateur |
| `GET` | `/api/download/apk` | Téléchargement direct de l'APK |
| `GET` | `/api/download/project`| Téléchargement direct de l'archive ZIP du projet |

---

## 🎨 6. Assets Graphiques & Icônes Android

Tous les visuels haute résolution sont situés dans le dossier `public/` :
- `public/pwa-192x192.png` : Icône 192x192 pour écrans mdpi/hdpi
- `public/pwa-512x512.png` : Icône 512x512 haute définition (Play Store & xxhdpi)
- `public/apple-touch-icon.png` : Icône pour écrans Retina
- `public/manifest.json` : Manifeste PWA complet avec déclaration des métadonnées
- `public/novashop-release.apk` : Version APK autonome pré-packagée

### Pour générer automatiquement toutes les densités Android (mipmap hdpi, xhdpi, xxhdpi, xxxhdpi) :
Vous pouvez utiliser l'outil officiel Capacitor Assets :
```bash
npm install -g @capacitor/assets
npx capacitor-assets generate --android
```

---

## 🔒 7. Sécurité & Variables d'Environnement

Le fichier `.env.example` contient les variables requises :
- `PORT` : Port d'écoute du serveur (par défaut `3000`)
- `NODE_ENV` : `development` ou `production`
- `GEMINI_API_KEY` : Clé d'API Google Gemini (optionnelle, un fallback local est intégré)

**IMPORTANT :** Ne partagez jamais vos clés privées ou certificats de signature Keystore (`*.jks`, `*.keystore`) sur des dépôts publics.

---

## 📞 8. Support & Contact

- **Application** : NovaShop Cameroun
- **Développé pour** : Plateforme mobile Android et e-commerce multi-canaux
- **Fichier d'archive du projet** : `novashop-complete-project.zip`
