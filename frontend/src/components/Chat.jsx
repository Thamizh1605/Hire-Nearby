import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

export default function Chat({ bookingId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    // Load messages
    loadMessages();

    // Connect to Socket.IO
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    socketRef.current = io(API_URL);

    socketRef.current.emit('join-booking', bookingId);
    socketRef.current.emit('user-online', user.id);

    socketRef.current.on('new-message', (message) => {
      setMessages((prev) => [...prev, message]);
      markAsRead();
    });

    socketRef.current.on('typing', ({ userName }) => {
      setTyping(true);
      setTypingUser(userName);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setTyping(false);
        setTypingUser(null);
      }, 3000);
    });

    socketRef.current.on('stop-typing', () => {
      setTyping(false);
      setTypingUser(null);
    });

    return () => {
      socketRef.current.emit('leave-booking', bookingId);
      socketRef.current.disconnect();
    };
  }, [bookingId, user.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const res = await api.get(`/bookings/${bookingId}/messages`);
      setMessages(res.data);
      markAsRead();
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const markAsRead = async () => {
    try {
      await api.patch(`/bookings/${bookingId}/messages/read`);
    } catch (error) {
      // Ignore errors
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await api.post(`/bookings/${bookingId}/messages`, {
        text: newMessage
      });
      setMessages((prev) => [...prev, res.data]);
      setNewMessage('');
      socketRef.current.emit('stop-typing', { bookingId });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleTyping = () => {
    socketRef.current.emit('typing', {
      bookingId,
      userId: user.id,
      userName: user.name
    });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit('stop-typing', { bookingId });
    }, 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-96 card">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${message.senderId._id === user.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow-soft ${
                message.senderId._id === user.id
                  ? 'bg-gradient-to-r from-sage-medium to-sage-dark text-white'
                  : 'bg-cream-light text-sage-dark border border-sage-light'
              }`}
            >
              <div className="text-sm font-semibold mb-1">
                {message.senderId.name}
              </div>
              <div>{message.text}</div>
              <div className="text-xs mt-1 opacity-75">
                {format(new Date(message.createdAt), 'HH:mm')}
                {message.read && message.senderId._id !== user.id && ' ✓✓'}
              </div>
            </div>
          </div>
        ))}
        {typing && typingUser && (
          <div className="text-sm text-sage-medium italic">
            {typingUser} is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="border-t border-sage-light p-4 bg-cream-light/50">
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="flex-1 input-field"
          />
          <button
            type="submit"
            className="btn-primary"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

