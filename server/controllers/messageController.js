import { supabase, supabaseAdmin } from '../config/supabase.js';
import { ApiError, asyncHandler } from '../utils/apiError.js';
import { getPaginationParams, formatPaginationResponse } from '../utils/pagination.js';

// In-memory conversations and messages store
let inMemoryConversations = [
  {
    id: 'conv-001',
    propertyId: 'prop-101',
    propertyTitle: 'The Solstice Pavilion',
    participants: ['usr-admin-001', 'usr-investor-001'],
    updatedAt: new Date().toISOString()
  }
];

let inMemoryMessages = [
  {
    id: 'msg-001',
    conversationId: 'conv-001',
    senderId: 'usr-investor-001',
    senderName: 'Alexander Wright',
    content: 'Good morning, I would like to confirm the private viewing schedule for The Solstice Pavilion.',
    readAt: null,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'msg-002',
    conversationId: 'conv-001',
    senderId: 'usr-admin-001',
    senderName: 'Julian Vane',
    content: 'Confirmed, Mr. Wright. The private concierge will welcome you at the estate at 11:00 AM.',
    readAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 1800000).toISOString()
  }
];

export const getConversations = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const isAdmin = req.user.role === 'Admin';

  let conversations = [];

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('conversation_participants')
        .select(`
          conversation_id,
          conversations (
            id,
            property_id,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', userId);

      if (!error && data) {
        conversations = data.map(d => d.conversations);
      }
    } catch (err) {}
  }

  if (conversations.length === 0) {
    conversations = inMemoryConversations.filter(c =>
      isAdmin || c.participants.includes(userId)
    );
  }

  return res.status(200).json({
    success: true,
    data: conversations
  });
});

export const getMessages = asyncHandler(async (req, res, next) => {
  const { conversationId } = req.params;
  const userId = req.user.id;
  const isAdmin = req.user.role === 'Admin';
  const { page, limit, from, to } = getPaginationParams(req.query, 50);

  // Check authorization
  const conv = inMemoryConversations.find(c => c.id === conversationId);
  if (conv && !isAdmin && !conv.participants.includes(userId)) {
    return next(new ApiError(403, 'You do not have permission to view messages in this conversation', 'FORBIDDEN_CONVERSATION'));
  }

  let messages = [];
  let totalCount = 0;
  let usedSupabase = false;

  if (supabase) {
    try {
      const { data, error, count } = await supabase
        .from('messages')
        .select('*', { count: 'exact' })
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .range(from, to);

      if (!error && data) {
        messages = data;
        totalCount = count || data.length;
        usedSupabase = true;
      }
    } catch (err) {}
  }

  if (!usedSupabase) {
    const list = inMemoryMessages.filter(m => m.conversationId === conversationId);
    totalCount = list.length;
    const startIndex = (page - 1) * limit;
    messages = list.slice(startIndex, startIndex + limit);
  }

  const response = formatPaginationResponse(messages, totalCount, page, limit);

  return res.status(200).json({
    success: true,
    ...response
  });
});

export const sendMessage = asyncHandler(async (req, res, next) => {
  const { conversationId, content } = req.body;
  const senderId = req.user.id;
  const senderName = req.user.name;

  const conv = inMemoryConversations.find(c => c.id === conversationId);
  if (conv && req.user.role !== 'Admin' && !conv.participants.includes(senderId)) {
    return next(new ApiError(403, 'You are not authorized to send messages in this conversation', 'FORBIDDEN_MESSAGE'));
  }

  const newMsg = {
    id: `msg-${Date.now()}`,
    conversationId,
    senderId,
    senderName,
    content,
    readAt: null,
    createdAt: new Date().toISOString()
  };

  if (supabase) {
    try {
      const client = supabaseAdmin || supabase;
      await client
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          sender_id: senderId,
          content
        }]);
    } catch (err) {}
  }

  inMemoryMessages.push(newMsg);

  return res.status(201).json({
    success: true,
    data: newMsg
  });
});
