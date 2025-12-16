import { useState, useRef, useEffect, useCallback } from 'react';
import { useSocket } from '../../hooks/useChat';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import ImageUpload from '../../components/common/ImageUpload';
import Header from '../../components/layout/Header';
import { MessageCircle, Users, User, Send, Image, Phone, Clock, CheckCircle, Search } from 'lucide-react';

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
        <div className="flex h-screen overflow-hidden bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900">
            {/* Área principal - Chat */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />

                <div className="flex-1 flex flex-col overflow-hidden">
                    {selectedUser ? (
                        <>
                            {/* Header del chat activo */}
                            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 border-b border-emerald-500/30 shadow-xl">
                                <div className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border-2 border-white/50">
                                                <span className="text-white font-black text-lg">{selectedUser.nombre.charAt(0).toUpperCase()}</span>
                                            </div>
                                            {isUserOnline(selectedUser._id) && (
                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full shadow-lg ring-2 ring-green-400/50 animate-pulse"></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-black text-white tracking-tight">{selectedUser.nombre}</h3>
                                            <div className="flex items-center gap-2">
                                                {isUserOnline(selectedUser._id) ? (
                                                    <span className="text-xs text-green-200 font-semibold flex items-center gap-1">
                                                        <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                                                        Activo ahora
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-emerald-200 font-medium">Desconectado</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Área de mensajes */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-emerald-950/40 to-teal-950/40">
                                {messages.length === 0 ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-emerald-400/20 max-w-md">
                                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-xl flex items-center justify-center">
                                                <MessageCircle className="w-10 h-10 text-emerald-300" />
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-2">¡Comienza la conversación!</h3>
                                            <p className="text-sm text-emerald-200">Envía el primer mensaje y conecta</p>
                                        </div>
                                    </div>
                                ) : (
                                    messages.map((msg, index) => {
                                        const isMyMessage = msg.senderId?.toString() === myUserId?.toString();

                                        return (
                                            <div
                                                key={msg._id || index}
                                                className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                                            >
                                                <div
                                                    className={`max-w-lg p-3 rounded-2xl shadow-lg backdrop-blur-sm transition-all hover:scale-[1.02] ${isMyMessage
                                                        ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-br-sm' 
                                                        : 'bg-white/90 text-emerald-900 border border-emerald-200/50 rounded-bl-sm'
                                                    }`}
                                                >
                                                    {msg.image && (
                                                        <div className="mb-2 relative group">
                                                            <img
                                                                src={msg.image}
                                                                alt="Imagen"
                                                                className="rounded-xl max-w-full max-h-64 cursor-pointer transition-transform group-hover:scale-105 shadow-md"
                                                                onClick={() => window.open(msg.image, '_blank')}
                                                            />
                                                            <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm rounded-lg p-1.5">
                                                                <Image className="w-3 h-3 text-white" />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {msg.text && (
                                                        <p className={`text-sm leading-relaxed break-words ${isMyMessage ? 'text-white' : 'text-emerald-900'}`}>
                                                            {msg.text}
                                                        </p>
                                                    )}

                                                    <div className={`flex items-center justify-between mt-2 pt-2 border-t ${isMyMessage ? 'border-emerald-300/30' : 'border-emerald-200/50'}`}>
                                                        <span className={`text-xs font-medium ${isMyMessage ? 'text-emerald-100' : 'text-emerald-600'}`}>
                                                            {formatTime(msg.createdAt)}
                                                        </span>
                                                        {isMyMessage && (
                                                            <CheckCircle className="w-3 h-3 text-emerald-200" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input de mensaje - Rediseñado */}
                            <div className="bg-emerald-800/40 backdrop-blur-xl border-t border-emerald-400/20 p-4 shadow-2xl">
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-2 items-end">
                                        <ImageUpload
                                            key={imageKey}
                                            onImageSelect={setImageUrl}
                                            onUploadComplete={setImageUrl}
                                            disabled={false}
                                        />
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                value={messageInput}
                                                onChange={(e) => setMessageInput(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                placeholder="Escribe un mensaje..."
                                                className="w-full px-4 py-3 text-sm bg-white/10 border border-emerald-400/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 placeholder-emerald-300/60 text-white font-medium shadow-lg backdrop-blur-sm transition-all"
                                            />
                                        </div>
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!messageInput.trim() && !imageUrl}
                                            className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 disabled:from-gray-600 disabled:to-gray-700 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-300"
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center p-8 max-w-md mx-auto">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-emerald-400/20 shadow-2xl">
                                    <MessageCircle className="w-14 h-14 text-emerald-300" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-3">Selecciona un chat</h3>
                                <p className="text-emerald-200 font-medium">Elige un contacto de la lista para comenzar</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar derecha - Lista de contactos */}
            <div className="w-80 bg-emerald-950/60 backdrop-blur-xl shadow-2xl flex flex-col border-l border-emerald-400/20">
                {/* Header del sidebar */}
                <div className="bg-gradient-to-b from-emerald-700/80 to-emerald-800/80 backdrop-blur-sm p-4 border-b border-emerald-400/20 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Contactos
                        </h2>
                        <div className="flex items-center gap-1.5 bg-emerald-500/30 px-3 py-1 rounded-full backdrop-blur-sm border border-emerald-400/30">
                            <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
                            <span className="text-xs font-bold text-white">{users.length}</span>
                        </div>
                    </div>
                    
                    {/* Buscador */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-300" />
                        <input
                            type="text"
                            placeholder="Buscar contacto..."
                            className="w-full pl-10 pr-4 py-2 text-sm bg-emerald-900/40 border border-emerald-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400/50 placeholder-emerald-300/50 text-white font-medium backdrop-blur-sm"
                        />
                    </div>
                </div>

                {/* Lista de usuarios */}
                <div className="flex-1 overflow-y-auto">
                    {loading && users.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="w-12 h-12 border-4 border-emerald-300/30 border-t-emerald-400 rounded-full animate-spin mx-auto mb-3"></div>
                            <p className="text-emerald-200 font-semibold text-sm">Cargando contactos...</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <Users className="w-10 h-10 text-emerald-300" />
                            </div>
                            <p className="text-base font-bold text-white mb-1">Sin contactos</p>
                            <p className="text-emerald-200 text-xs">No hay usuarios disponibles</p>
                        </div>
                    ) : (
                        <div className="p-2 space-y-1">
                            {users.map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() => setSelectedUser(user)}
                                    className={`p-3 rounded-xl cursor-pointer transition-all duration-300 group ${selectedUser?._id === user._id
                                        ? 'bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border border-emerald-400/40 shadow-lg' 
                                        : 'hover:bg-emerald-800/40 border border-transparent hover:border-emerald-400/20'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex-shrink-0">
                                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-black shadow-lg transition-transform group-hover:scale-110 ${selectedUser?._id === user._id 
                                                ? 'bg-gradient-to-br from-emerald-400 to-teal-400' 
                                                : 'bg-gradient-to-br from-emerald-500/60 to-teal-500/60'
                                            }`}>
                                                {user.nombre.charAt(0).toUpperCase()}
                                            </div>
                                            {isUserOnline(user._id) && (
                                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-emerald-950 rounded-full shadow-lg ring-2 ring-green-400/30 animate-pulse"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`font-bold text-sm truncate ${selectedUser?._id === user._id ? 'text-white' : 'text-emerald-100 group-hover:text-white'}`}>
                                                {user.nombre}
                                            </h3>
                                            <p className={`text-xs truncate ${selectedUser?._id === user._id ? 'text-emerald-200' : 'text-emerald-300/70 group-hover:text-emerald-200'}`}>
                                                {user.email}
                                            </p>
                                        </div>
                                        {isUserOnline(user._id) && (
                                            <div className="flex-shrink-0">
                                                <div className="w-2 h-2 bg-green-400 rounded-full shadow-lg ring-2 ring-green-400/30 animate-pulse"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer del sidebar */}
                <div className="p-3 bg-emerald-900/60 backdrop-blur-sm border-t border-emerald-400/20">
                    <div className="text-center">
                        <p className="text-xs text-emerald-300/70 font-medium">
                            {users.filter(u => isUserOnline(u._id)).length} en línea
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;