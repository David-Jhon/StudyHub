import axios from 'axios';

const API_URL = '';

export const uploadFile = async (file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
            if (progressEvent.total && onProgress) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percentCompleted);
            }
        },
    });

    return response.data;
};

export const deleteFile = async (filename: string, password: string) => {
    const response = await axios.delete(`${API_URL}/api/delete`, {
        headers: {
            'x-admin-password': password,
        },
        data: {
            filename,
        },
    });
    return response.data;
};
