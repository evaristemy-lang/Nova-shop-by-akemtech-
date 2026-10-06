import React, { useState } from 'react';
import { X, CheckSquare, Calendar, Users, Sparkles, Check } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { workspaceService } from '../../services/workspaceService';

export const WorkspaceModal: React.FC = () => {
  const { isWorkspaceOpen, setIsWorkspaceOpen, orders, showToast } = useShop();
  const [activeTab, setActiveTab] = useState<'tasks' | 'calendar'>('tasks');
  const [syncedOrderIds, setSyncedOrderIds] = useState<Record<string, boolean>>({});

  if (!isWorkspaceOpen) return null;

  const handleSyncTask = async (orderId: string, text: string) => {
    await workspaceService.createFulfillmentTask(`Commande ${orderId}`, text);
    setSyncedOrderIds(prev => ({ ...prev, [orderId]: true }));
    showToast('Tâche de livraison ajoutée à Google Tasks ! 📅');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Google Workspace Sync</h3>
              <p className="text-[10px] text-slate-400">Intégration Google Tasks & Calendar</p>
            </div>
          </div>
          <button
            onClick={() => setIsWorkspaceOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 text-xs">
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Synchronisez vos expéditions et vos suivis de colis directement avec vos outils Google professionnels.
          </p>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[10px]">Commandes à synchroniser :</h4>
            {orders.slice(0, 3).map(o => (
              <div key={o.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white text-xs">#{o.id} - {o.customerName}</p>
                  <p className="text-[10px] text-slate-400">{o.deliveryAddress.city} • {o.status.toUpperCase()}</p>
                </div>
                <button
                  onClick={() => handleSyncTask(o.id, `Livraison à ${o.deliveryAddress.city} pour ${o.customerName}`)}
                  disabled={syncedOrderIds[o.id]}
                  className={`px-3 py-1.5 rounded-xl font-bold text-[10px] flex items-center gap-1 transition-colors ${
                    syncedOrderIds[o.id]
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {syncedOrderIds[o.id] ? <Check className="w-3 h-3" /> : <CheckSquare className="w-3 h-3" />}
                  <span>{syncedOrderIds[o.id] ? 'Synchronisé' : 'Ajouter à Tasks'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
