import { supabase } from '../../../lib/supabase/client'

export const notificationService = {
  async getNotifications(limit = 20) {
    const { data, error } = await supabase
      .from('notifications')
      .select('id, title, body, type, reference_id, is_read, created_at')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw new Error(error.message)
    return data || []
  },

  async markRead(id) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)

    if (error) throw new Error(error.message)
  },

  async markAllRead() {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('is_read', false)

    if (error) throw new Error(error.message)
  },

  subscribe(userId, onChange) {
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      }, onChange)
      .subscribe()

    return () => supabase.removeChannel(channel)
  },
}
