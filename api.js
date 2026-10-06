class APIClient {
    constructor() {
        this.client = null;
        this.backendConfigured = false;
        this.configurationError = '';

        const config = window.SUPABASE_CONFIG || {};
        if (!config.url || !config.anonKey) {
            this.configurationError = 'أضف رابط Supabase ومفتاح anon في supabase-config.js لتفعيل قاعدة البيانات.';
            return;
        }

        if (!window.supabase || typeof window.supabase.createClient !== 'function') {
            this.configurationError = 'تعذر تحميل مكتبة Supabase. تحقق من الاتصال بالإنترنت وأعد المحاولة.';
            return;
        }

        const storage = {
            getItem: (key) => sessionStorage.getItem(key) ?? localStorage.getItem(key),
            setItem: (key, value) => {
                const remember = localStorage.getItem('albane_remember') === 'true';
                const target = remember ? localStorage : sessionStorage;
                const other = remember ? sessionStorage : localStorage;
                target.setItem(key, value);
                other.removeItem(key);
            },
            removeItem: (key) => {
                localStorage.removeItem(key);
                sessionStorage.removeItem(key);
            }
        };

        try {
            this.client = window.supabase.createClient(config.url, config.anonKey, {
                auth: { storage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
            });
            this.backendConfigured = true;
        } catch {
            this.configurationError = 'إعدادات Supabase غير صالحة. تحقق من رابط المشروع ومفتاح anon في supabase-config.js.';
        }
    }

    getClient() {
        if (!this.client) throw new Error(this.configurationError || 'خدمة تسجيل الدخول غير متاحة.');
        return this.client;
    }

    authError(error) {
        const message = String(error?.message || '').toLowerCase();
        if (message.includes('invalid login credentials') || message.includes('invalid_credentials')) {
            return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
        }
        if (message.includes('email not confirmed')) return 'يرجى تأكيد بريدك الإلكتروني قبل تسجيل الدخول.';
        if (message.includes('user already registered')) return 'هذا البريد الإلكتروني مسجل من قبل.';
        if (message.includes('password should be at least')) return 'كلمة المرور قصيرة جدًا.';
        if (message.includes('rate limit')) return 'محاولات كثيرة. انتظر قليلًا ثم أعد المحاولة.';
        if (message.includes('failed to fetch') || message.includes('network')) {
            return 'تعذر الاتصال بخدمة الحسابات. تحقق من الإنترنت وإعدادات Supabase.';
        }
        return error?.message || 'تعذرت العملية. حاول مرة أخرى.';
    }

    normalizeProfile(profile = {}) {
        return {
            id: profile.id || '',
            name: profile.name || profile.full_name || profile.email?.split('@')[0] || 'User',
            email: profile.email || '',
            phone: profile.phone || '',
            role: profile.role || 'client',
            city: profile.city || '',
            specialty: profile.specialty || profile.spec || '',
            avatar: profile.avatar || ''
        };
    }

    normalizeAuthUser(authUser, profile = {}) {
        const metadata = authUser?.user_metadata || {};
        const appMetadata = authUser?.app_metadata || {};
        const role = appMetadata.role === 'admin'
            ? 'admin'
            : (profile.role || (metadata.role === 'artisan' ? 'artisan' : 'client'));

        return this.normalizeProfile({
            id: authUser?.id,
            ...metadata,
            ...profile,
            id: authUser?.id,
            email: authUser?.email || profile.email,
            role,
            name: profile.name || metadata.name || metadata.full_name,
            phone: profile.phone || metadata.phone,
            city: profile.city || metadata.city,
            specialty: profile.specialty || metadata.specialty
        });
    }

    async resolveAuthUser(authUser) {
        const { data: profile, error } = await this.getClient()
            .from('profiles')
            .select('id,email,name,phone,role,city,avatar')
            .eq('id', authUser.id)
            .maybeSingle();
        if (error) throw error;
        if (!profile) throw new Error('لم يتم العثور على الملف الشخصي. شغّل supabase_schema.sql ثم أعد تسجيل الدخول.');

        const user = this.normalizeAuthUser(authUser, profile);
        if (user.role === 'artisan') {
            const { data: artisan, error: artisanError } = await this.getClient()
                .from('artisans')
                .select('specialty,experience_years,description,portfolio')
                .eq('id', authUser.id)
                .maybeSingle();
            if (artisanError) throw artisanError;
            if (artisan) {
                user.specialty = artisan.specialty || user.specialty;
                user.experience = artisan.experience_years || 0;
                user.bio = artisan.description || '';
                user.gallery = artisan.portfolio || [];
            }
        }
        localStorage.setItem('albane_user', JSON.stringify(user));
        return user;
    }

    saveSession(session) {
        if (!session?.access_token || !session.user) {
            throw new Error('تم الاتصال لكن لم يتم إنشاء جلسة صالحة. حاول تسجيل الدخول مرة أخرى.');
        }
        const remember = localStorage.getItem('albane_remember') === 'true';
        const tokenStorage = remember ? localStorage : sessionStorage;
        const otherStorage = remember ? sessionStorage : localStorage;
        tokenStorage.setItem('albane_token', session.access_token);
        otherStorage.removeItem('albane_token');
        localStorage.setItem('albane_user', JSON.stringify(this.normalizeAuthUser(session.user)));
    }

    clearSession() {
        localStorage.removeItem('albane_token');
        sessionStorage.removeItem('albane_token');
        localStorage.removeItem('albane_user');
    }

    getCachedUser() {
        const serialized = localStorage.getItem('albane_user');
        if (!serialized) return null;
        try {
            return JSON.parse(serialized);
        } catch {
            this.clearSession();
            return null;
        }
    }

    getCachedToken() {
        return localStorage.getItem('albane_token') || sessionStorage.getItem('albane_token');
    }

    normalizeArtisan(row) {
        if (!row) return row;
        return {
            ...row,
            avatar: row.avatar || row.image || '',
            isElite: row.isElite ?? row.is_elite ?? false,
            exp: row.exp ?? row.experience_years ?? row.experience ?? 0,
            experience: row.experience ?? row.experience_years ?? row.exp ?? 0,
            spec: row.spec || row.category || row.specialty || '',
            specialty: row.specialty || row.spec || row.category || '',
            category: row.category || row.specialty || row.spec || '',
            bio: row.bio || row.description || '',
            gallery: row.gallery || row.portfolio || [],
            portfolio: row.portfolio || row.gallery || [],
            rating: row.avg_rating ?? row.rating ?? 0,
            reviews: row.reviews ?? row.review_count ?? 0
        };
    }

    normalizeTool(row) {
        return row ? {
            ...row,
            brand: row.brand || row.supplier || '',
            categoryLabel: row.categoryLabel ?? row.category_label ?? row.category ?? ''
        } : row;
    }

    async getCurrentUser() {
        try {
            const { data, error } = await this.getClient().auth.getUser();
            if (error) throw error;
            if (!data.user) {
                this.clearSession();
                return { success: true, user: null, data: { user: null } };
            }

            const { data: sessionData, error: sessionError } = await this.client.auth.getSession();
            if (sessionError) throw sessionError;
            if (sessionData.session) this.saveSession(sessionData.session);
            const user = await this.resolveAuthUser(data.user);
            return { success: true, user, data: { user } };
        } catch (error) {
            return { success: false, message: this.authError(error), user: null, data: { user: null } };
        }
    }

    async login(email, password, remember = false) {
        try {
            const normalizedEmail = String(email || '').trim().toLowerCase();
            if (!normalizedEmail || !password) {
                return { success: false, message: 'أدخل البريد الإلكتروني وكلمة المرور.' };
            }

            this.getClient();
            localStorage.setItem('albane_remember', remember ? 'true' : 'false');
            const { data, error } = await this.client.auth.signInWithPassword({
                email: normalizedEmail,
                password
            });
            if (error) throw error;
            this.saveSession(data.session);
            const user = await this.resolveAuthUser(data.user);
            return { success: true, user };
        } catch (error) {
            return { success: false, message: this.authError(error) };
        }
    }

    async register({ name, email, phone, password, role, specialty, city }) {
        try {
            const normalizedEmail = String(email || '').trim().toLowerCase();
            const normalizedName = String(name || '').trim();
            const normalizedPhone = String(phone || '').trim();
            const normalizedRole = role === 'artisan' ? 'artisan' : 'client';

            if (!normalizedName || !normalizedEmail || !normalizedPhone || !password || !city) {
                return { success: false, message: 'يرجى ملء جميع الحقول المطلوبة.' };
            }
            if (normalizedRole === 'artisan' && !specialty) {
                return { success: false, message: 'اختر تخصصك المهني.' };
            }
            if (String(password).length < 8) {
                return { success: false, message: 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.' };
            }

            this.getClient();
            localStorage.setItem('albane_remember', 'true');
            const redirectTo = new URL('login.html', window.location.href).toString();
            const { data, error } = await this.client.auth.signUp({
                email: normalizedEmail,
                password,
                options: {
                    emailRedirectTo: redirectTo,
                    data: {
                        name: normalizedName,
                        phone: normalizedPhone,
                        role: normalizedRole,
                        specialty: normalizedRole === 'artisan' ? specialty : '',
                        city
                    }
                }
            });
            if (error) throw error;

            if (!data.session) {
                return { success: true, confirmationRequired: true, user: null };
            }
            this.saveSession(data.session);
            const user = await this.resolveAuthUser(data.user);
            return { success: true, confirmationRequired: false, user };
        } catch (error) {
            return { success: false, message: this.authError(error) };
        }
    }

    async logout() {
        try {
            const { error } = await this.getClient().auth.signOut();
            if (error) throw error;
            this.clearSession();
            localStorage.removeItem('albane_remember');
            return { success: true };
        } catch (error) {
            return { success: false, message: this.authError(error) };
        }
    }

    async updateProfile(profile = {}) {
        try {
            const { data: authData, error: authError } = await this.getClient().auth.getUser();
            if (authError) throw authError;
            if (!authData.user) return { success: false, message: 'سجل الدخول لتحديث ملفك الشخصي.' };

            const profileData = {
                name: String(profile.name || '').trim(),
                phone: String(profile.phone || '').trim(),
                city: String(profile.city || '').trim(),
                avatar: profile.avatar ?? authData.user.user_metadata?.avatar ?? null
            };
            const { data: savedProfile, error: savedProfileError } = await this.client
                .from('profiles')
                .select('role')
                .eq('id', authData.user.id)
                .single();
            if (savedProfileError) throw savedProfileError;

            let artisanData = null;
            if (savedProfile.role === 'artisan') {
                artisanData = {
                    id: authData.user.id,
                    specialty: String(profile.specialty || '').trim(),
                    experience_years: Number(profile.experience ?? profile.exp ?? 0) || 0,
                    description: String(profile.bio || profile.description || '').trim(),
                    portfolio: Array.isArray(profile.gallery)
                        ? profile.gallery
                        : (Array.isArray(profile.portfolio) ? profile.portfolio : [])
                };
                if (!artisanData.specialty) {
                    return { success: false, message: 'اختر تخصصك المهني قبل حفظ الملف.' };
                }
            }

            const { error: profileError } = await this.client
                .from('profiles')
                .update(profileData)
                .eq('id', authData.user.id);
            if (profileError) throw profileError;

            if (artisanData) {
                const { error: artisanError } = await this.client
                    .from('artisans')
                    .upsert(artisanData, { onConflict: 'id' });
                if (artisanError) throw artisanError;
            }

            const updatedUser = this.normalizeAuthUser({
                ...authData.user,
                user_metadata: {
                    ...authData.user.user_metadata,
                    ...profileData,
                    specialty: profile.specialty,
                    experience: profile.experience ?? profile.exp,
                    bio: profile.bio,
                    gallery: profile.gallery
                }
            });
            Object.assign(updatedUser, {
                specialty: profile.specialty || updatedUser.specialty,
                experience: profile.experience ?? profile.exp ?? 0,
                bio: profile.bio || profile.description || '',
                gallery: profile.gallery || profile.portfolio || []
            });
            localStorage.setItem('albane_user', JSON.stringify(updatedUser));
            return { success: true, user: updatedUser };
        } catch (error) {
            return { success: false, message: this.authError(error) };
        }
    }

    async getArtisans(filters = {}) {
        try {
            if (!this.backendConfigured) return { success: true, data: [] };
            let query = this.getClient().from('artisans_view').select('*');
            if (filters.category) query = query.eq('specialty', filters.category);
            if (filters.city) query = query.eq('city', filters.city);
            const { data, error } = await query;
            if (error) throw error;

            const term = String(filters.q || '').trim().toLocaleLowerCase();
            const artisans = (data || []).map((row) => this.normalizeArtisan(row));
            const filtered = term
                ? artisans.filter((artisan) =>
                    [artisan.name, artisan.specialty, artisan.city, artisan.description]
                        .some((value) => String(value || '').toLocaleLowerCase().includes(term)))
                : artisans;
            return { success: true, data: filtered };
        } catch (error) {
            return { success: false, message: this.authError(error), data: [] };
        }
    }

    async getArtisanById(id) {
        try {
            if (!this.backendConfigured) return { success: false, message: 'بيانات الحرفيين غير مربوطة بعد.' };
            let artisanId = String(id || '').trim();
            if (artisanId === 'me') {
                const { data: authData, error: authError } = await this.getClient().auth.getUser();
                if (authError) throw authError;
                if (!authData.user) return { success: false, message: 'سجل الدخول لعرض ملفك الشخصي.' };
                artisanId = authData.user.id;
            }
            if (!artisanId) return { success: false, message: 'معرّف الحرفي غير صالح.' };

            const { data, error } = await this.getClient()
                .from('artisans_view')
                .select('*')
                .eq('id', artisanId)
                .maybeSingle();
            if (error) throw error;
            return data
                ? { success: true, data: this.normalizeArtisan(data) }
                : { success: false, message: 'لم يتم العثور على ملف الحرفي.' };
        } catch (error) {
            return { success: false, message: this.authError(error) };
        }
    }

    async addArtisan(artisan = {}) {
        try {
            const { data: authData, error: authError } = await this.getClient().auth.getUser();
            if (authError) throw authError;
            if (!authData.user) return { success: false, message: 'سجل الدخول لإضافة ملف الحرفي.' };
            const specialty = String(artisan.specialty || artisan.spec || '').trim();
            if (!specialty) return { success: false, message: 'اختر تخصصك المهني.' };

            const row = {
                id: authData.user.id,
                specialty,
                experience_years: Number(artisan.experience_years ?? artisan.experience ?? artisan.exp ?? 0) || 0,
                description: String(artisan.description || artisan.bio || '').trim(),
                portfolio: artisan.portfolio || artisan.gallery || []
            };
            const { data, error } = await this.getClient()
                .from('artisans')
                .upsert(row, { onConflict: 'id' })
                .select('*')
                .single();
            if (error) throw error;
            return { success: true, data: this.normalizeArtisan(data) };
        } catch (error) {
            return { success: false, message: this.authError(error) };
        }
    }

    async getTools() {
        try {
            if (!this.backendConfigured) return { success: true, data: [] };
            const { data, error } = await this.getClient()
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return { success: true, data: (data || []).map((row) => this.normalizeTool(row)) };
        } catch (error) {
            return { success: false, message: this.authError(error), data: [] };
        }
    }

    async getToolById(id) {
        try {
            if (!this.backendConfigured) return { success: false, message: 'بيانات المنتجات غير مربوطة بعد.' };
            const { data, error } = await this.getClient()
                .from('products')
                .select('*')
                .eq('id', id)
                .maybeSingle();
            if (error) throw error;
            return data
                ? { success: true, data: this.normalizeTool(data) }
                : { success: false, message: 'لم يتم العثور على المنتج.' };
        } catch (error) {
            return { success: false, message: this.authError(error) };
        }
    }

    async addTool(tool = {}) {
        try {
            const row = {
                name: String(tool.name || '').trim(),
                description: String(tool.description || '').trim(),
                category: String(tool.category || '').trim(),
                price: Number(tool.price),
                image: tool.image || null,
                supplier: String(tool.supplier || tool.brand || '').trim(),
                available: true
            };
            if (!row.name || !row.category || !Number.isFinite(row.price) || row.price < 0) {
                return { success: false, message: 'تحقق من اسم المنتج وفئته وسعره.' };
            }
            const { data, error } = await this.getClient()
                .from('products')
                .insert(row)
                .select('*')
                .single();
            if (error) throw error;
            return { success: true, data: this.normalizeTool(data) };
        } catch (error) {
            return { success: false, message: this.authError(error) };
        }
    }

    async deleteTool(id) {
        try {
            if (!id) return { success: false, message: 'معرّف المنتج غير صالح.' };
            const { error } = await this.getClient().from('products').delete().eq('id', id);
            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, message: this.authError(error) };
        }
    }

    async getClients() {
        try {
            if (!this.backendConfigured) return { success: true, data: [] };
            const { data, error } = await this.getClient()
                .from('profiles')
                .select('*')
                .eq('role', 'client')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return { success: true, data: (data || []).map((row) => this.normalizeProfile(row)) };
        } catch (error) {
            return { success: false, message: this.authError(error), data: [] };
        }
    }
    async getActivities() {
        return { success: false, message: 'سجل النشاطات غير متاح: لا يوجد جدول activities في قاعدة البيانات.', data: [] };
    }
    async addActivity() {
        return { success: false, message: 'إضافة النشاطات غير متاحة: لا يوجد جدول activities في قاعدة البيانات.' };
    }
    async getMessages() {
        try {
            const { data: authData, error: authError } = await this.getClient().auth.getUser();
            if (authError) throw authError;
            if (!authData.user) return { success: false, message: 'سجل الدخول لعرض رسائلك.', data: [] };

            const { data, error } = await this.client
                .from('messages')
                .select('id,sender_id,receiver_id,content,read,created_at')
                .order('created_at', { ascending: true });
            if (error) throw error;

            const currentUser = this.normalizeAuthUser(authData.user);
            return {
                success: true,
                data: (data || []).map((message) => ({
                    ...message,
                    senderId: message.sender_id,
                    receiverId: message.receiver_id,
                    senderName: message.sender_id === authData.user.id ? currentUser.name : 'مستخدم',
                    receiverName: message.receiver_id === authData.user.id ? currentUser.name : 'مستخدم',
                    timestamp: message.created_at,
                    status: message.read ? 'read' : 'unread'
                }))
            };
        } catch (error) {
            return { success: false, message: this.authError(error), data: [] };
        }
    }

    async addMessage(message = {}) {
        try {
            const content = String(message.content || '').trim();
            const receiverId = String(message.receiver_id || message.receiverId || '').trim();
            if (!content || !receiverId) {
                return { success: false, message: 'اكتب الرسالة وحدد المستلم.' };
            }

            const { data: authData, error: authError } = await this.getClient().auth.getUser();
            if (authError) throw authError;
            if (!authData.user) return { success: false, message: 'سجل الدخول لإرسال رسالة.' };
            if (receiverId === authData.user.id) return { success: false, message: 'لا يمكنك مراسلة حسابك.' };

            const { data, error } = await this.client
                .from('messages')
                .insert({
                    sender_id: authData.user.id,
                    receiver_id: receiverId,
                    content
                })
                .select('id,sender_id,receiver_id,content,read,created_at')
                .single();
            if (error) throw error;

            const sender = this.normalizeAuthUser(authData.user);
            return {
                success: true,
                data: {
                    ...data,
                    senderId: data.sender_id,
                    receiverId: data.receiver_id,
                    senderName: sender.name,
                    receiverName: message.receiver_name || message.receiverName || 'مستخدم',
                    timestamp: data.created_at,
                    status: data.read ? 'read' : 'unread'
                }
            };
        } catch (error) {
            return { success: false, message: this.authError(error) };
        }
    }
    async getReviews(artisanId) {
        try {
            if (!this.backendConfigured) return { success: true, data: [] };
            let query = this.getClient()
                .from('reviews')
                .select('id,artisan_id,client_id,rating,comment,created_at')
                .order('created_at', { ascending: false });
            if (artisanId) {
                query = query.eq('artisan_id', artisanId);
            } else {
                const { data: authData, error: authError } = await this.getClient().auth.getUser();
                if (authError) throw authError;
                if (!authData.user) return { success: false, message: 'سجل الدخول لعرض تقييماتك.', data: [] };
                query = query.eq('client_id', authData.user.id);
            }
            const { data, error } = await query;
            if (error) throw error;
            return {
                success: true,
                data: (data || []).map((review) => ({ ...review, client: 'مستخدم' }))
            };
        } catch (error) {
            return { success: false, message: this.authError(error), data: [] };
        }
    }
}

window.api = new APIClient();
