import { Product } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateProductData(product: Partial<Product>): ValidationResult {
  const errors: string[] = [];

  if (!product.name || product.name.trim().length < 3) {
    errors.push('Le nom du produit doit comporter au moins 3 caractères.');
  }

  if (typeof product.price !== 'number' || product.price <= 0) {
    errors.push('Le prix doit être un nombre strictement positif en FCFA.');
  }

  if (product.discountPrice !== undefined && product.discountPrice !== null) {
    if (typeof product.discountPrice !== 'number' || product.discountPrice < 0) {
      errors.push('Le prix promotionnel doit être un montant valide.');
    } else if (product.discountPrice >= (product.price || 0)) {
      errors.push('Le prix promotionnel doit être inférieur au prix normal.');
    }
  }

  if (typeof product.stockCount !== 'number' || product.stockCount < 0) {
    errors.push('La quantité en stock doit être supérieure ou égale à 0.');
  }

  if (!product.category) {
    errors.push('Veuillez sélectionner une catégorie valide.');
  }

  if (!product.images || product.images.length === 0) {
    errors.push('Au moins une image de produit est requise.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
