import { useState, useRef, useEffect, useCallback } from 'react';
import { useSocket } from '../../hooks/useChat';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import ImageUpload from '../../components/common/ImageUpload';
import Header from '../../components/layout/Header';
import { MessageCircle, Users, User, Send, Image, Phone, Clock, CheckCircle } from 'lucide-react';

export const useMessages = (selectedUserId) => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { socket } = useSocket();

    const { userId } = useAuth();
    const myUserId = userId;

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/messages/users`);
            setUsers(response.data.data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMessages = useCallback(async (userId) => {
        if (!userId) return;

        try {
            setLoading(true);
            const response = await axios.get(`/messages/${userId}`);
            const data = response.data.data;
            setMessages(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching messages:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const sendMessage = useCallback(async (receiverId, text, imageUrl = null) => {
        if ((!text || !text.trim()) && !imageUrl) return;
        if (!myUserId) return;

        try {
            const response = await axios.post(`/messages/${receiverId}`, {
                text: text || '',
                image: imageUrl
            });

            const data = response.data.data;

            const newMessage = {
                _id: data._id,
                senderId: myUserId,
                receiverId,
                text: text || '',
                image: imageUrl,
                createdAt: data.createdAt || new Date()
            };

            setMessages(prev => [...prev, newMessage]);

        } catch (err) {
            setError(err.message);
            console.error('Error sending message:', err);
        }
    }, [myUserId]);

    useEffect(() => {
        if (!socket) {
            return;
        }

        const handleReceiveMessage = (newMessage) => {
            if (newMessage.senderId === selectedUserId) {
                setMessages(prev => [...prev, newMessage]);
            }
        };

        socket.on('receive-message', handleReceiveMessage);

        return () => {
            socket.off('receive-message', handleReceiveMessage);
        };
    }, [socket, selectedUserId]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        if (selectedUserId) {
            fetchMessages(selectedUserId);
        } else {
            setMessages([]);
        }
    }, [selectedUserId, fetchMessages]);

    return {
        messages,
        myUserId,
        users,
        loading,
        error,
        sendMessage,
        fetchMessages
    };
};

const Chat = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    const [imageKey, setImageKey] = useState(0);
    const messagesEndRef = useRef(null);

    const { myUserId, messages, users, loading, sendMessage } = useMessages(selectedUser?._id);
    const { onlineUsers } = useSocket();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if ((!messageInput.trim() && !imageUrl) || !selectedUser) return;

        sendMessage(selectedUser._id, messageInput, imageUrl);

        setMessageInput('');
        setImageUrl(null);
        setImageKey(prev => prev + 1);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const isUserOnline = (userId) => {
        return onlineUsers.some(id => id.toString() === userId.toString());
    };

    const formatTime = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100">
            {/* Sidebar - Lista de usuarios */}
            <div className="w-64 bg-white/90 backdrop-blur-xl shadow-lg flex flex-col border-r border-emerald-200/50">
                <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-black text-white tracking-tight drop-shadow-md">
                            Mensajes
                        </h2>
                        <div className="flex items-center gap-1.5 text-emerald-100 text-xs font-semibold bg-emerald-500/30 px-2 py-1 rounded-lg backdrop-blur-sm">
                            <Users className="w-3 h-3" />
                            {users.length}
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading && users.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-3 shadow-lg"></div>
                            <p className="text-emerald-700 font-semibold text-sm">Cargando...</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-xl flex items-center justify-center shadow-lg">
                                <MessageCircle className="w-10 h-10 text-emerald-500" />
                            </div>
                            <p className="text-lg font-black text-emerald-900 mb-1">No hay usuarios</p>
                            <p className="text-emerald-600 font-semibold text-xs">Selecciona un contacto</p>
                        </div>
                    ) : (
                        users.map((user) => (
                            <div
                                key={user._id}
                                onClick={() => setSelectedUser(user)}
                                className={`p-3 border-b border-emerald-100/50 cursor-pointer transition-all duration-300 group hover:shadow-sm hover:shadow-emerald-500/20 hover:-translate-x-0.5 ${selectedUser?._id === user._id
                                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-l-4 border-emerald-500' 
                                    : 'hover:bg-emerald-50/50'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg border-2 ${selectedUser?._id === user._id 
                                            ? 'bg-gradient-to-br from-emerald-500 to-teal-500 border-emerald-400' 
                                            : 'bg-gradient-to-br from-emerald-400 to-teal-400 border-emerald-300 group-hover:border-emerald-500'
                                        }`}>
                                            {user.nombre.charAt(0).toUpperCase()}
                                        </div>
                                        {isUserOnline(user._id) && (
                                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-md ring-2 ring-emerald-500/30 animate-pulse"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-black text-sm ${selectedUser?._id === user._id ? 'text-emerald-900' : 'text-emerald-800 group-hover:text-emerald-900'} truncate`}>
                                            {user.nombre}
                                        </h3>
                                        <p className="text-xs text-emerald-600 font-semibold truncate">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Área principal */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />

                <div className="flex-1 flex flex-col overflow-hidden">
                    {selectedUser ? (
                        <>
                            {/* Header del chat */}
                            <div className="p-3 bg-white/80 backdrop-blur-xl border-b border-emerald-200/50 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                                        <span className="text-white font-black text-sm">{selectedUser.nombre.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-black text-emerald-900">{selectedUser.nombre}</h3>
                                        <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                                            {isUserOnline(selectedUser._id) ? (
                                                <>
                                                    <CheckCircle className="w-3 h-3 text-emerald-500 animate-pulse" />
                                                    En línea
                                                </>
                                            ) : (
                                                <Clock className="w-3 h-3 text-gray-400" />
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Mensajes */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-emerald-50 to-teal-50">
                                {messages.length === 0 ? (
                                    <div className="text-center mt-20">
                                        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center shadow-lg border-2 border-white/50">
                                            <MessageCircle className="w-12 h-12 text-emerald-500" />
                                        </div>
                                        <h3 className="text-xl font-black text-emerald-900 mb-2">¡Inicia la conversación!</h3>
                                        <p className="text-sm text-emerald-600 font-semibold">Sé el primero en enviar un mensaje</p>
                                    </div>
                                ) : (
                                    messages.map((msg, index) => {
                                        const isMyMessage = msg.senderId?.toString() === myUserId?.toString();

                                        return (
                                            <div
                                                key={msg._id || index}
                                                className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-md p-3 rounded-xl shadow-md transition-all hover:shadow-lg ${isMyMessage
                                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-none' 
                                                        : 'bg-white text-emerald-900 border border-emerald-200/50 rounded-bl-none hover:bg-emerald-50/50'
                                                    }`}
                                                >
                                                    {msg.image && (
                                                        <div className="mb-2">
                                                            <img
                                                                src={msg.image}
                                                                alt="Imagen enviada"
                                                                className="rounded-lg max-w-full max-h-48 cursor-pointer hover:scale-105 transition-all shadow-md border-2 border-white/50"
                                                                onClick={() => window.open(msg.image, '_blank')}
                                                            />
                                                            <Image className={`w-3 h-3 mt-1 ml-auto ${isMyMessage ? 'text-emerald-200' : 'text-emerald-500'}`} />
                                                        </div>
                                                    )}

                                                    {msg.text && (
                                                        <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                                                    )}

                                                    <div className={`flex items-center gap-1 mt-2 pt-2 border-t ${isMyMessage ? 'border-emerald-300/50 justify-end' : 'border-emerald-200/50 justify-start'}`}>
                                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isMyMessage ? 'bg-emerald-400/30 text-emerald-100' : 'bg-emerald-100 text-emerald-700'}`}>
                                                            {formatTime(msg.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input de mensaje */}
                            <div className="bg-white/90 backdrop-blur-xl border-t border-emerald-200/50 p-3 shadow-lg">
                                <div className="flex flex-col lg:flex-row gap-2 items-end">
                                    <ImageUpload
                                        key={imageKey}
                                        onImageSelect={setImageUrl}
                                        onUploadComplete={setImageUrl}
                                        disabled={false}
                                    />
                                    <div className="flex-1 flex gap-2">
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                value={messageInput}
                                                onChange={(e) => setMessageInput(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                placeholder="Escribe tu mensaje..."
                                                className="w-full px-4 py-2.5 text-sm bg-emerald-50/50 border border-emerald-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400/75 placeholder-emerald-500 font-semibold shadow-sm hover:shadow-md transition-all duration-300"
                                            />
                                        </div>
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!messageInput.trim() && !imageUrl}
                                            className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
                            <div className="text-center p-8 max-w-md mx-auto">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center shadow-lg border-2 border-white/50">
                                    <MessageCircle className="w-16 h-16 text-emerald-500" />
                                </div>
                                <h3 className="text-2xl font-black text-emerald-900 mb-3 drop-shadow-md">Selecciona un contacto</h3>
                                <p className="text-base text-emerald-600 font-semibold">Elige un usuario para comenzar a chatear</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;