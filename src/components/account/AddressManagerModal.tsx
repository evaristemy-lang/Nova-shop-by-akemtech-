import React, { useState } from 'react';
import { X, MapPin, Plus, Check, Trash2, Home, Briefcase } from 'lucide-react';
import { SavedAddress } from '../../types';
import { useShop } from '../../context/ShopContext';

interface AddressManagerModalProps {
  onClose: () => void;
}

export const AddressManagerModal: React.FC<AddressManagerModalProps> = ({ onClose }) => {
  const { savedAddresses, addSavedAddress, deleteSavedAddress, setDefaultAddress } = useShop();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newLabel, setNewLabel] = useState('Domicile');
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCity, setNewCity] = useState('Douala');
  const [newNeighborhood, setNewNeighborhood] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newPhone || !newStreet) return;

    addSavedAddress({
      label: newLabel,
      fullName: newFullName,
      phone: newPhone,
      city: newCity,
      neighborhood: newNeighborhood,
      street: newStreet,
      notes: newNotes,
      isDefault
    });

    setIsAddingNew(false);
    setNewFullName('');
    setNewPhone('');
    setNewNeighborhood('');
    setNewStreet('');
    setNewNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Mes Adresses de Livraison</h3>
              <p className="text-[10px] text-slate-400">Carnet d&apos;adresses Douala & Yaoundé</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          {!isAddingNew ? (
            <>
              <div className="space-y-2.5">
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      addr.isDefault
                        ? 'bg-blue-950/30 border-blue-500/40 text-blue-200'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {addr.label.toLowerCase().includes('bureau') ? (
                          <Briefcase className="w-4 h-4 text-indigo-400" />
                        ) : (
                          <Home className="w-4 h-4 text-blue-400" />
                        )}
                        <span className="font-extrabold text-white text-xs">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="text-[9px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-md">
                            Principale
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {!addr.isDefault && (
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-[10px] text-blue-400 hover:underline font-semibold"
                          >
                            Définir principale
                          </button>
                        )}
                        <button
                          onClick={() => deleteSavedAddress(addr.id)}
                          className="p-1 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 text-[11px] space-y-0.5 text-slate-300">
                      <p className="font-semibold text-white">{addr.fullName} • {addr.phone}</p>
                      <p>{addr.street}, {addr.neighborhood ? `${addr.neighborhood}, ` : ''}{addr.city}</p>
                      {addr.notes && <p className="text-[10px] text-slate-400 italic">Note: {addr.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsAddingNew(true)}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-800 hover:border-blue-500/50 text-slate-300 hover:text-blue-400 font-bold text-xs flex items-center justify-center gap-2 transition-colors mt-2"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter une nouvelle adresse</span>
              </button>
            </>
          ) : (
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-white">Nouvelle Adresse</span>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-slate-400 hover:underline"
                >
                  Annuler
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-400">Libellé</label>
                  <select
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white"
                  >
                    <option value="Domicile">Domicile</option>
                    <option value="Bureau">Bureau</option>
                    <option value="Famille">Famille</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-400">Ville</label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white"
                  >
                    <option value="Douala">Douala</option>
                    <option value="Yaoundé">Yaoundé</option>
                    <option value="Bafoussam">Bafoussam</option>
                    <option value="Kribi">Kribi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-400">Nom du destinataire *</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="Ex: Eric N."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-400">Numéro de téléphone *</label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+237 6XX XX XX XX"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-400">Quartier</label>
                <input
                  type="text"
                  value={newNeighborhood}
                  onChange={(e) => setNewNeighborhood(e.target.value)}
                  placeholder="Ex: Bonanjo, Bastos, Akwa..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-400">Rue / Immeuble / Repère *</label>
                <input
                  type="text"
                  required
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  placeholder="Ex: Rue Joss, face pharmacie..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="default-check"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-blue-600"
                />
                <label htmlFor="default-check" className="text-slate-300 font-medium">
                  Définir comme adresse principale de livraison
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Enregistrer cette adresse</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
