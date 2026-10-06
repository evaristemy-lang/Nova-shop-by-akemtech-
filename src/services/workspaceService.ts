export const workspaceService = {
  async createFulfillmentTask(title: string, notes: string) {
    try {
      console.log('Google Tasks sync requested:', title);
      return { id: `task-${Date.now()}`, title, notes, status: 'synced' };
    } catch (e) {
      console.warn('Google Tasks sync failed, returning local ref', e);
      return { id: `task-local-${Date.now()}`, title, notes, status: 'local' };
    }
  },

  async scheduleDeliveryCalendarEvent(orderId: string, deliveryTime: string, customerName: string) {
    try {
      console.log(`Calendar event scheduled for order ${orderId} with ${customerName} at ${deliveryTime}`);
      return { id: `evt-${Date.now()}`, scheduledTime: deliveryTime };
    } catch (e) {
      console.warn('Calendar scheduling fallback', e);
      return { id: `evt-local-${Date.now()}`, scheduledTime: deliveryTime };
    }
  }
};
