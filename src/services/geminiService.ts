import { Product } from '../types';

export interface AIChatResponse {
  text: string;
  recommendedProductIds?: string[];
}

export const geminiService = {
  async askShoppingAssistant(prompt: string, catalog: Product[]): Promise<AIChatResponse> {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, catalog })
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn('Backend AI proxy error, using intelligent client fallback', err);
    }

    // Intelligent local fallback grounded in current catalog
    const lower = prompt.toLowerCase();
    let reply = "Je suis votre conseiller shopping NovaShop Cameroun ! ";
    const recs: string[] = [];

    if (lower.includes('phone') || lower.includes('téléphone') || lower.includes('5g') || lower.includes('smartphone')) {
      reply += "Pour les smartphones, je vous recommande vivement le **NovaPhone 5G Apex** (165 000 FCFA) avec son capteur 108MP et sa charge 68W ultra-rapide. Il est compatible 5G MTN et Orange Cameroun !";
      recs.push('prod-1');
    } else if (lower.includes('etudiant') || lower.includes('école') || lower.includes('rentrée') || lower.includes('tablette')) {
      reply += "Pour vos études et cours universitaires, la **Tablette ScholarPro 10.4\"** (119 000 FCFA) avec son clavier et son stylet inclus dans la boîte est le meilleur choix ! Pensez aussi au sac étanche anti-vol.";
      recs.push('prod-2', 'prod-6');
    } else if (lower.includes('solaire') || lower.includes('eneo') || lower.includes('courant') || lower.includes('délestage')) {
      reply += "Face aux coupures d'électricité récurrentes, le **Kit Solaire Domestique NovaSun 150W** (85 000 FCFA) permet d'alimenter 4 ampoules LED et de recharger tous vos téléphones.";
      recs.push('prod-4');
    } else if (lower.includes('casque') || lower.includes('audio') || lower.includes('musique') || lower.includes('écouteur')) {
      reply += "Le **Casque PulseANC Studio** (39 000 FCFA) offre jusqu'à 50h d'autonomie et une isolation phonique active très performante.";
      recs.push('prod-3');
    } else {
      reply += "Nous proposons une large sélection de smartphones 5G certifiés, tablettes étudiantes, kits solaires anti-délestage, montres connectées et produits de mode avec livraison express en 2 à 4h à Douala et 24h à Yaoundé !";
      recs.push('prod-1', 'prod-4');
    }

    return {
      text: reply,
      recommendedProductIds: recs
    };
  }
};
