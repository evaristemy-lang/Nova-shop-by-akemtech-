# NovaShop - Mobile E-Commerce & Business Platform

NovaShop est une plateforme e-commerce mobile-first moderne conçue pour le marché camerounais (Douala, Yaoundé et régions). Elle intègre un catalogue multi-catégories, la gestion des paniers, un processus de commande avec Mobile Money (MTN MoMo, Orange Money) et paiement à la livraison, le suivi en direct des commandes, un conseiller shopping propulsé par Gemini AI, et un tableau de bord d'administration complet.

## 🚀 Fonctionnalités Clés

- **Catalogue Produits Multi-Catégories** : Smartphones 5G, Électronique & Audio, Matériel Étudiant, Solaire & Maison (solutions anti-coupure), Mode et Beauté.
- **Expérience Mobile Optimisée** : Interface réactive inspirée d'Android avec barre d'état et navigation inférieure fixée.
- **Paiements Locaux & Internationaux** :
  - MTN Mobile Money
  - Orange Money
  - Paiement Cash à la livraison (Cash on Delivery)
  - Carte bancaire
  - Commande directe rapide via WhatsApp
- **Suivi des Commandes en Temps Réel** : Chronologie interactive étape par étape (Validation, Préparation, Expédition, Livraison).
- **Génération de Factures Officielles** : Téléchargement et impression de reçus d'achat conformes avec QR Code.
- **Assistant d'Achat IA (Gemini)** : Recommandations personnalisées de produits basées sur les besoins réels (autonomie, budget FCFA, énergie solaire).
- **Tableau de Bord Administrateur (BMS)** :
  - Gestion des stocks et inventaire en temps réel
  - Mises à jour des statuts des commandes
  - Création et édition de fiches produits avec upload d'images
  - Traitement des demandes de retours et garanties
- **Multi-Devises** : Support natif du FCFA (XAF), EUR (€), USD ($) et NGN (₦).

## 🛠️ Stack Technique

- **Frontend** : React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Backend** : Express.js, Node.js, TypeScript (`tsx`)
- **Intelligence Artificielle** : Google GenAI SDK (`@google/genai`)
- **Build Tool** : Vite

## 📦 Installation & Démarrage

### Prérequis
- Node.js (version 20 ou supérieure)
- npm ou bun

### 1. Cloner le projet
```bash
git clone <URL_DU_DEPOT_GITHUB>
cd novashop
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer les variables d'environnement
Créez un fichier `.env` à la racine :
```env
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=votre_cle_gemini_ici
```
*(Remarque : Si aucune clé Gemini n'est fournie, l'assistant bascule automatiquement sur un modèle intelligent local sans interrompre l'expérience utilisateur).*

### 4. Lancer en mode développement
```bash
npm run dev
```
L'application sera accessible sur `http://localhost:3000`.

### 5. Compiler pour la production
```bash
npm run build
npm start
```

## 🔐 Identifiants Administrateur Démo

- **Email** : `admin@novashop.cm`
- **Mot de passe** : `admin2026`

Accès direct via l'onglet **Compte** > **Portail Administrateur**.

## 📄 Licence
Apache-2.0
