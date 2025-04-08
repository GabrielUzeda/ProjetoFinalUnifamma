$(document).ready(function() {
    // Inicializa o admin
    Admin.start();
});

const Admin = {
    async start() {
        // Carregar dados iniciais
        await this.loadInitialData();

        // Inicializar eventos
        this.initializeEvents();

        // Inicializar máscaras
        this.initializeMasks();
    },

    async loadInitialData() {
        try {
            // Carregar dados do About
            const aboutResponse = await this.fetchData('/api/about');
            if (aboutResponse.erro === 0) {
                this.populateAboutForm(aboutResponse.dados);
            }

            // Carregar dados do Features
            const featuresResponse = await this.fetchData('/api/features');
            if (featuresResponse.erro === 0) {
                this.populateFeaturesForm(featuresResponse.dados);
            }

            // Carregar dados do Models
            const modelsResponse = await this.fetchData('/api/models');
            if (modelsResponse.erro === 0) {
                this.populateModelsForm(modelsResponse.dados);
            }

            // Carregar dados do Testimonials
            const testimonialsResponse = await this.fetchData('/api/testimonials');
            if (testimonialsResponse.erro === 0) {
                this.populateTestimonialsForm(testimonialsResponse.dados);
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            Swal.fire({
                title: 'Erro!',
                text: 'Erro ao carregar dados. Por favor, recarregue a página.',
                icon: 'error'
            });
        }
    },

    initializeEvents() {
        // Eventos do formulário About
        $('#add-paragraph').click(() => this.addParagraph());
        $('#about-form').submit((e) => this.handleAboutSubmit(e));

        // Eventos do formulário Features
        $('#add-feature').click(() => this.addFeature());
        $('#features-form').submit((e) => this.handleFeaturesSubmit(e));

        // Eventos do formulário Models
        $('#add-model').click(() => this.addModel());
        $('#models-form').submit((e) => this.handleModelsSubmit(e));

        // Eventos do formulário Testimonials
        $('#add-testimonial').click(() => this.addTestimonial());
        $('#testimonials-form').submit((e) => this.handleTestimonialsSubmit(e));

        // Eventos de remoção
        $(document).on('click', '.remove-paragraph', function() {
            $(this).closest('.paragraph-group').remove();
        });

        $(document).on('click', '.remove-feature', function() {
            $(this).closest('.feature-group').remove();
        });

        $(document).on('click', '.remove-model', function() {
            $(this).closest('.model-group').remove();
        });

        $(document).on('click', '.remove-testimonial', function() {
            $(this).closest('.testimonial-group').remove();
        });

        $(document).on('click', '.add-model-feature', function() {
            const featuresList = $(this).closest('.form-group').find('.features-list');
            featuresList.append(`
                <div class="feature-item">
                    <input type="text" class="form-control model-feature" required>
                    <button type="button" class="btn btn-danger remove-feature">Remover</button>
                </div>
            `);
        });
    },

    initializeMasks() {
        // Máscara para preços em BRL
        $('.model-price').mask('R$ #.##0,00', {
            reverse: true,
            placeholder: 'R$ 0,00'
        });
    },

    async fetchData(endpoint) {
        try {
            const response = await fetch(`http://localhost:3000${endpoint}`);
            return await response.json();
        } catch (error) {
            throw new Error(`Erro ao buscar dados de ${endpoint}: ${error.message}`);
        }
    },

    async sendData(endpoint, data) {
        try {
            const response = await fetch(`http://localhost:3000${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            throw new Error(`Erro ao enviar dados para ${endpoint}: ${error.message}`);
        }
    },

    // Funções para preencher formulários
    populateAboutForm(data) {
        $('#about-title').val(data.titulo);
        $('#about-image-url').val(data.imagem.url);
        $('#about-image-alt').val(data.imagem.alt);
        
        const paragraphsContainer = $('#about-paragraphs');
        paragraphsContainer.empty();
        
        data.paragrafos.forEach(paragraph => {
            paragraphsContainer.append(`
                <div class="paragraph-group">
                    <textarea class="form-control paragraph-text" required>${paragraph}</textarea>
                    <button type="button" class="btn btn-danger remove-paragraph">Remover</button>
                </div>
            `);
        });
    },

    populateFeaturesForm(data) {
        const featuresContainer = $('#features-list');
        featuresContainer.empty();
        
        data.forEach(feature => {
            featuresContainer.append(`
                <div class="feature-group">
                    <div class="form-group">
                        <label>Ícone</label>
                        <input type="text" class="form-control feature-icon" value="${feature.icone}" required>
                    </div>
                    <div class="form-group">
                        <label>Título</label>
                        <input type="text" class="form-control feature-title" value="${feature.titulo}" required>
                    </div>
                    <div class="form-group">
                        <label>Descrição</label>
                        <textarea class="form-control feature-description" required>${feature.descricao}</textarea>
                    </div>
                    <button type="button" class="btn btn-danger remove-feature">Remover</button>
                </div>
            `);
        });
    },

    populateModelsForm(data) {
        const modelsContainer = $('#models-list');
        modelsContainer.empty();
        
        data.forEach(model => {
            const featuresHtml = model.caracteristicas.map(feature => `
                <div class="feature-item">
                    <input type="text" class="form-control model-feature" value="${feature}" required>
                    <button type="button" class="btn btn-danger remove-feature">Remover</button>
                </div>
            `).join('');

            modelsContainer.append(`
                <div class="model-group">
                    <div class="form-group">
                        <label>Nome</label>
                        <input type="text" class="form-control model-name" value="${model.nome}" required>
                    </div>
                    <div class="form-group">
                        <label>Preço</label>
                        <input type="text" class="form-control model-price" value="${model.preco.replace('R$ ', '')}" required>
                    </div>
                    <div class="form-group">
                        <label>Descrição</label>
                        <textarea class="form-control model-description" required>${model.descricao}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Características</label>
                        <div class="features-list">
                            ${featuresHtml}
                        </div>
                        <button type="button" class="btn btn-secondary add-model-feature">Adicionar Característica</button>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" class="model-featured" ${model.destaque ? 'checked' : ''}> Modelo em Destaque
                        </label>
                    </div>
                    <button type="button" class="btn btn-danger remove-model">Remover Modelo</button>
                </div>
            `);
        });
    },

    populateTestimonialsForm(data) {
        const testimonialsContainer = $('#testimonials-list');
        testimonialsContainer.empty();
        
        data.forEach(testimonial => {
            testimonialsContainer.append(`
                <div class="testimonial-group">
                    <div class="form-group">
                        <label>Depoimento</label>
                        <textarea class="form-control testimonial-text" required>${testimonial.depoimento}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Nome do Cliente</label>
                        <input type="text" class="form-control client-name" value="${testimonial.cliente.nome}" required>
                    </div>
                    <div class="form-group">
                        <label>Cidade</label>
                        <input type="text" class="form-control client-city" value="${testimonial.cliente.cidade}" required>
                    </div>
                    <div class="form-group">
                        <label>URL da Foto</label>
                        <input type="url" class="form-control client-photo" value="${testimonial.cliente.foto}" required>
                    </div>
                    <button type="button" class="btn btn-danger remove-testimonial">Remover</button>
                </div>
            `);
        });
    },

    // Funções para adicionar novos itens
    addParagraph() {
        $('#about-paragraphs').append(`
            <div class="paragraph-group">
                <textarea class="form-control paragraph-text" required></textarea>
                <button type="button" class="btn btn-danger remove-paragraph">Remover</button>
            </div>
        `);
    },

    addFeature() {
        $('#features-list').append(`
            <div class="feature-group">
                <div class="form-group">
                    <label>Ícone</label>
                    <input type="text" class="form-control feature-icon" required>
                </div>
                <div class="form-group">
                    <label>Título</label>
                    <input type="text" class="form-control feature-title" required>
                </div>
                <div class="form-group">
                    <label>Descrição</label>
                    <textarea class="form-control feature-description" required></textarea>
                </div>
                <button type="button" class="btn btn-danger remove-feature">Remover</button>
            </div>
        `);
    },

    addModel() {
        $('#models-list').append(`
            <div class="model-group">
                <div class="form-group">
                    <label>Nome</label>
                    <input type="text" class="form-control model-name" required>
                </div>
                <div class="form-group">
                    <label>Preço</label>
                    <input type="text" class="form-control model-price" required>
                </div>
                <div class="form-group">
                    <label>Descrição</label>
                    <textarea class="form-control model-description" required></textarea>
                </div>
                <div class="form-group">
                    <label>Características</label>
                    <div class="features-list">
                        <div class="feature-item">
                            <input type="text" class="form-control model-feature" required>
                            <button type="button" class="btn btn-danger remove-feature">Remover</button>
                        </div>
                    </div>
                    <button type="button" class="btn btn-secondary add-model-feature">Adicionar Característica</button>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" class="model-featured"> Modelo em Destaque
                    </label>
                </div>
                <button type="button" class="btn btn-danger remove-model">Remover Modelo</button>
            </div>
        `);
        this.initializeMasks();
    },

    addTestimonial() {
        $('#testimonials-list').append(`
            <div class="testimonial-group">
                <div class="form-group">
                    <label>Depoimento</label>
                    <textarea class="form-control testimonial-text" required></textarea>
                </div>
                <div class="form-group">
                    <label>Nome do Cliente</label>
                    <input type="text" class="form-control client-name" required>
                </div>
                <div class="form-group">
                    <label>Cidade</label>
                    <input type="text" class="form-control client-city" required>
                </div>
                <div class="form-group">
                    <label>URL da Foto</label>
                    <input type="url" class="form-control client-photo" required>
                </div>
                <button type="button" class="btn btn-danger remove-testimonial">Remover</button>
            </div>
        `);
    },

    // Handlers de submit
    async handleAboutSubmit(e) {
        e.preventDefault();
        
        const paragraphs = [];
        $('.paragraph-text').each(function() {
            paragraphs.push($(this).val());
        });

        const data = {
            title: $('#about-title').val(),
            image_url: $('#about-image-url').val(),
            image_alt: $('#about-image-alt').val(),
            paragraphs: paragraphs
        };

        try {
            const response = await this.sendData('/api/about', data);
            if (response.erro === 0) {
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Dados atualizados com sucesso.',
                    icon: 'success'
                });
            } else {
                throw new Error(response.mensagem);
            }
        } catch (error) {
            Swal.fire({
                title: 'Erro!',
                text: error.message,
                icon: 'error'
            });
        }
    },

    async handleFeaturesSubmit(e) {
        e.preventDefault();
        
        const features = [];
        $('.feature-group').each(function() {
            features.push({
                icone: $(this).find('.feature-icon').val(),
                titulo: $(this).find('.feature-title').val(),
                descricao: $(this).find('.feature-description').val()
            });
        });

        try {
            const response = await this.sendData('/api/features', features);
            if (response.erro === 0) {
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Dados atualizados com sucesso.',
                    icon: 'success'
                });
            } else {
                throw new Error(response.mensagem);
            }
        } catch (error) {
            Swal.fire({
                title: 'Erro!',
                text: error.message,
                icon: 'error'
            });
        }
    },

    async handleModelsSubmit(e) {
        e.preventDefault();
        
        const models = [];
        $('.model-group').each(function() {
            const features = [];
            $(this).find('.model-feature').each(function() {
                features.push($(this).val());
            });

            const modelData = {
                nome: $(this).find('.model-name').val(),
                preco: $(this).find('.model-price').val(),
                descricao: $(this).find('.model-description').val(),
                caracteristicas: features,
                destaque: $(this).find('.model-featured').is(':checked')
            };
            
            console.log('Dados do modelo:', modelData);
            models.push(modelData);
        });

        console.log('Dados a serem enviados:', models);

        try {
            const response = await this.sendData('/api/models', models);
            console.log('Resposta do servidor:', response);
            if (response.erro === 0) {
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Dados atualizados com sucesso.',
                    icon: 'success'
                });
            } else {
                throw new Error(response.mensagem);
            }
        } catch (error) {
            Swal.fire({
                title: 'Erro!',
                text: error.message,
                icon: 'error'
            });
        }
    },

    async handleTestimonialsSubmit(e) {
        e.preventDefault();
        
        const testimonials = [];
        $('.testimonial-group').each(function() {
            const testimonialData = {
                depoimento: $(this).find('.testimonial-text').val(),
                cliente: {
                    nome: $(this).find('.client-name').val(),
                    cidade: $(this).find('.client-city').val(),
                    foto: $(this).find('.client-photo').val()
                }
            };
            
            console.log('Dados do depoimento:', testimonialData);
            testimonials.push(testimonialData);
        });

        console.log('Dados a serem enviados:', testimonials);

        try {
            const response = await this.sendData('/api/testimonials', testimonials);
            console.log('Resposta do servidor:', response);
            if (response.erro === 0) {
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Dados atualizados com sucesso.',
                    icon: 'success'
                });
            } else {
                throw new Error(response.mensagem);
            }
        } catch (error) {
            Swal.fire({
                title: 'Erro!',
                text: error.message,
                icon: 'error'
            });
        }
    }
}; 