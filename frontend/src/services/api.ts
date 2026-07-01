import { axios } from '@/utils/axios';

// Helper to extract data from axios response
const extractData = <T>(promise: Promise<{ data: { data: T } }>): Promise<T> =>
  promise.then((res) => res.data.data);

// ------------------ AUTH ------------------
export interface RegisterData {
  email: string;
  passwordHash?: string; // mapping password to password
  password?: string;
  username: string;
  displayName: string;
  role: 'player' | 'organizer';
}

export interface LoginData {
  email: string;
  password?: string;
}

export const authApi = {
  register: (data: RegisterData) =>
    axios.post('/auth/register', data).then((res) => res.data),
  login: (data: LoginData) =>
    extractData<{ user: any; token: string }>(axios.post('/auth/login', data)),
  logout: () => axios.post('/auth/logout').then((res) => res.data),
};

// ------------------ USER ------------------
export const userApi = {
  getMe: () => extractData<any>(axios.get('/users/me')),
  updateMe: (data: any) => extractData<any>(axios.put('/users/me', data)),
};

// ------------------ PLAYER ------------------
export interface PlayerFilters {
  game?: string;
  rank?: string;
  role?: string;
}

export const playerApi = {
  list: (filters?: PlayerFilters) =>
    extractData<any[]>(axios.get('/players', { params: filters })),
  get: (id: string) => extractData<any>(axios.get(`/players/${id}`)),
  createProfile: (data: { mainGame: string; primaryRole: string; rank: string }) =>
    axios.post('/players/me', data).then((res) => res.data),
  updateProfile: (data: any) => extractData<any>(axios.put('/players/me', data)),
};

// ------------------ ORGANIZATION ------------------
export const orgApi = {
  create: (data: { name: string; logoUrl?: string; games: string[]; description?: string }) =>
    axios.post('/organizations', data).then((res) => res.data),
  get: (slug: string) => extractData<any>(axios.get(`/organizations/${slug}`)),
  update: (id: string, data: any) => extractData<any>(axios.put(`/organizations/${id}`, data)),
  createTeam: (id: string, data: { name: string; game: string; logoUrl?: string }) =>
    axios.post(`/organizations/${id}/teams`, data).then((res) => res.data),
  createRecruitment: (
    id: string,
    data: { title: string; game: string; roleNeeded: string; description: string },
  ) => axios.post(`/organizations/${id}/recruitments`, data).then((res) => res.data),
  getApplications: (id: string) =>
    extractData<any[]>(axios.get(`/organizations/${id}/applications`)),
};

// ------------------ TEAM ------------------
export const teamApi = {
  updateMembers: (id: string, data: { playerId: string; action: 'add' | 'remove'; roleOnTeam?: string }) =>
    extractData<any>(axios.put(`/teams/${id}/members`, data)),
};

// ------------------ RECRUITMENT ------------------
export const recruitmentApi = {
  list: (filters?: { status?: string; game?: string }) =>
    extractData<any[]>(axios.get('/recruitments/', { params: filters })),
  apply: (id: string, data: { message?: string }) =>
    axios.post(`/recruitments/${id}/apply`, data).then((res) => res.data),
};

// ------------------ APPLICATION ------------------
export const applicationApi = {
  decide: (id: string, data: { status: 'accepted' | 'rejected' }) =>
    extractData<any>(axios.patch(`/applications/${id}`, data)),
};

// ------------------ NOTIFICATION ------------------
export const notificationApi = {
  list: () => extractData<any[]>(axios.get('/notifications')),
  markAsRead: (id: string) => extractData<any>(axios.patch(`/notifications/${id}/read`)),
};

// ------------------ CHAT ------------------
export const chatApi = {
  listThreads: () => extractData<any[]>(axios.get('/chats')),
  createThread: (participantIds: string[]) =>
    axios.post('/chats', { participantIds }).then((res) => res.data),
  getMessages: (threadId: string) =>
    extractData<any[]>(axios.get(`/chats/${threadId}/messages`)),
  sendMessage: (threadId: string, text: string) =>
    axios.post(`/chats/${threadId}/messages`, { text }).then((res) => res.data),
};
