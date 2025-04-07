const API_BASE_URL = 'http://localhost:3000/api';

const Connections = {
    async fetchData(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error(`Erro ao buscar dados de ${endpoint}:`, error);
            return { success: false, error: error.message };
        }
    },

    async fetchAbout() {
        return await this.fetchData('about');
    },

    async fetchFeatures() {
        return await this.fetchData('features');
    },

    async fetchModels() {
        return await this.fetchData('models');
    },

    async fetchTestimonials() {
        return await this.fetchData('testimonials');
    }
}; 