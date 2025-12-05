import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
        prepareHeaders: (headers, { getState }) => {
            // Get token from Redux state
            const token = getState().auth.user?.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Leads', 'Products', 'Orders', 'Users', 'Customizations', 'Settings', 'Costings', 'Documents'],
    endpoints: (builder) => ({
        // ==================== AUTH ENDPOINTS ====================
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),

        register: builder.mutation({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
        }),

        forgotPassword: builder.mutation({
            query: (email) => ({
                url: '/auth/forgot-password',
                method: 'POST',
                body: { email },
            }),
        }),

        resetPassword: builder.mutation({
            query: ({ token, password }) => ({
                url: `/auth/reset-password/${token}`,
                method: 'PUT',
                body: { password },
            }),
        }),

        getUsers: builder.query({
            query: () => '/auth/users',
            providesTags: ['Users'],
        }),

        updateUser: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/auth/users/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Users'],
        }),

        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/auth/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Users'],
        }),

        // ==================== LEAD ENDPOINTS ====================
        getLeads: builder.query({
            query: () => '/leads',
            providesTags: ['Leads'],
        }),

        getMyLeads: builder.query({
            query: () => '/leads/my-leads',
            providesTags: ['Leads'],
        }),

        createLead: builder.mutation({
            query: (leadData) => ({
                url: '/leads',
                method: 'POST',
                body: leadData,
            }),
            invalidatesTags: ['Leads'],
        }),

        updateLead: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/leads/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Leads', 'Orders'], // Also invalidate orders in case ORDER_CONFIRMED
        }),

        // ==================== PRODUCT ENDPOINTS ====================
        getProducts: builder.query({
            query: (params = {}) => ({
                url: '/products',
                params,
            }),
            providesTags: ['Products'],
        }),

        getProductById: builder.query({
            query: (id) => `/products/${id}`,
            providesTags: (result, error, id) => [{ type: 'Products', id }],
        }),

        getMyProducts: builder.query({
            query: () => '/products/my-products',
            providesTags: ['Products'],
        }),

        getPendingDesigns: builder.query({
            query: (status) => `/products/pending-designs?status=${status}`,
            providesTags: ['Products'],
        }),

        createProduct: builder.mutation({
            query: (formData) => ({
                url: '/products',
                method: 'POST',
                body: formData,
                // FormData sets its own Content-Type with boundary
                formData: true,
            }),
            invalidatesTags: ['Products'],
        }),

        updateProduct: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/products/${id}`,
                method: 'PUT',
                body: formData,
                // FormData sets its own Content-Type with boundary
                formData: true,
            }),
            invalidatesTags: ['Products'],
        }),

        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Products'],
        }),

        approveProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}/approval`,
                method: 'PUT',
                body: { approvalStatus: 'APPROVED', status: 'ACTIVE' },
            }),
            invalidatesTags: ['Products'],
        }),

        rejectProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}/approval`,
                method: 'PUT',
                body: { approvalStatus: 'REJECTED', status: 'INACTIVE' },
            }),
            invalidatesTags: ['Products'],
        }),

        // ==================== ORDER ENDPOINTS ====================
        getMyOrders: builder.query({
            query: () => '/orders/my-orders',
            providesTags: ['Orders'],
        }),

        createOrder: builder.mutation({
            query: (orderData) => ({
                url: '/orders',
                method: 'POST',
                body: orderData,
            }),
            invalidatesTags: ['Orders'],
        }),

        generatePI: builder.mutation({
            query: (id) => ({
                url: `/orders/${id}/generate-pi`,
                method: 'POST',
            }),
            invalidatesTags: ['Orders'],
        }),

        // ==================== CUSTOMIZATION ENDPOINTS ====================
        getCustomizations: builder.query({
            query: () => '/customizations',
            providesTags: ['Customizations'],
        }),

        getSellerCustomizations: builder.query({
            query: () => '/customizations/seller-requests',
            providesTags: ['Customizations'],
        }),

        getMyCustomizations: builder.query({
            query: () => '/customizations/my-requests',
            providesTags: ['Customizations'],
        }),

        createCustomization: builder.mutation({
            query: (customizationData) => ({
                url: '/customizations',
                method: 'POST',
                body: customizationData,
            }),
            invalidatesTags: ['Customizations'],
        }),

        updateCustomization: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/customizations/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Customizations'],
        }),

        // ==================== COSTING ENDPOINTS ====================
        createCosting: builder.mutation({
            query: (costingData) => ({
                url: '/costings',
                method: 'POST',
                body: costingData,
            }),
            invalidatesTags: ['Costings'],
        }),

        // ==================== SETTINGS ENDPOINTS ====================
        getSettings: builder.query({
            query: () => '/settings',
            providesTags: ['Settings'],
        }),

        updateSettings: builder.mutation({
            query: (settings) => ({
                url: '/settings',
                method: 'PUT',
                body: settings,
            }),
            invalidatesTags: ['Settings'],
        }),

        // ==================== DOCUMENT ENDPOINTS ====================
        // Get all documents for buyer's orders
        getMyDocuments: builder.query({
            query: () => '/documents/my-orders',
            providesTags: ['Documents'],
        }),

        // Get documents for a specific order
        getOrderDocuments: builder.query({
            query: (orderId) => `/documents/order/${orderId}`,
            providesTags: ['Documents'],
        }),

        // Get all documents (admin only)
        getAllDocuments: builder.query({
            query: (params = {}) => ({
                url: '/documents/all',
                params,
            }),
            providesTags: ['Documents'],
        }),

        // Generate Proforma Invoice
        generatePI: builder.mutation({
            query: (orderId) => ({
                url: `/documents/generate-pi/${orderId}`,
                method: 'POST',
            }),
            invalidatesTags: ['Documents', 'Orders'],
        }),

        // Generate Commercial Invoice
        generateCI: builder.mutation({
            query: ({ orderId, ...data }) => ({
                url: `/documents/generate-ci/${orderId}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Documents', 'Orders'],
        }),

        // Generate Packing List
        generatePackingList: builder.mutation({
            query: ({ orderId, ...data }) => ({
                url: `/documents/generate-packing-list/${orderId}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Documents', 'Orders'],
        }),

        // Upload AWB
        uploadAWB: builder.mutation({
            query: ({ orderId, ...data }) => ({
                url: `/documents/upload-awb/${orderId}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Documents', 'Orders'],
        }),

        // Download document
        downloadDocument: builder.query({
            query: (documentId) => `/documents/${documentId}/download`,
        }),

        // Update document status
        updateDocumentStatus: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/documents/${id}/status`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Documents'],
        }),
    }),
});

// Export hooks for usage in components
export const {
    // Auth
    useLoginMutation,
    useRegisterMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useGetUsersQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,

    // Leads
    useGetLeadsQuery,
    useGetMyLeadsQuery,
    useCreateLeadMutation,
    useUpdateLeadMutation,

    // Products
    useGetProductsQuery,
    useGetProductByIdQuery,
    useGetMyProductsQuery,
    useGetPendingDesignsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useApproveProductMutation,
    useRejectProductMutation,

    // Orders
    useGetMyOrdersQuery,
    useCreateOrderMutation,

    // Customizations
    useGetCustomizationsQuery,
    useGetSellerCustomizationsQuery,
    useGetMyCustomizationsQuery,
    useCreateCustomizationMutation,
    useUpdateCustomizationMutation,

    // Costings
    useCreateCostingMutation,

    // Settings
    useGetSettingsQuery,
    useUpdateSettingsMutation,

    // Documents
    useGetMyDocumentsQuery,
    useGetOrderDocumentsQuery,
    useGetAllDocumentsQuery,
    useGeneratePIMutation,
    useGenerateCIMutation,
    useGeneratePackingListMutation,
    useUploadAWBMutation,
    useDownloadDocumentQuery,
    useUpdateDocumentStatusMutation,
} = apiSlice;
