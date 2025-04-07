$(document).ready(function() {
    // Inicializa o controller
    Controller.start();
});

const Controller = {
    async start() {
        // Tentar carregar dados do backend
        await this.loadDataFromBackend();
        
        // Renderizar os templates com Mustache
        this.renderTemplates();

        // Inicializar máscara do telefone
        $('#phone').mask('(00) 00000-0000');
     
        // Função para validar o formulário de contato
        $('.contact-form').on('submit', async function(e) {
            e.preventDefault();

            // Validação HTML5 já feita pelo navegador
            if (!this.checkValidity()) {
                this.reportValidity();
                return;
            }

            try {
                const formData = new FormData(this);
                
                // Mostrar loading
                Swal.fire({
                    title: 'Enviando...',
                    text: 'Por favor, aguarde enquanto processamos sua solicitação.',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                const response = await fetch('http://localhost:3000/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(Object.fromEntries(formData))
                });

                const data = await response.json();

                // Fechar loading
                Swal.close();

                if (data.erro === 0) {
                    Swal.fire({
                        title: 'Sucesso!',
                        text: data.mensagem,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3085d6'
                    }).then(() => {
                        this.reset();
                    });
                } else {
                    Swal.fire({
                        title: 'Erro!',
                        text: data.mensagem || 'Erro ao enviar mensagem. Por favor, tente novamente.',
                        icon: 'error',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#d33'
                    });
                }
            } catch (error) {
                console.error('Erro ao enviar formulário:', error);
                Swal.fire({
                    title: 'Erro!',
                    text: 'Erro ao enviar mensagem. Por favor, tente novamente.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#d33'
                });
            }
        });

        // Suavizar a rolagem para os links de navegação
        $('a[href^="#"]').on('click', function(e) {
            e.preventDefault();
            const target = $($(this).attr('href'));
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 800);
            }
        });

        // Adicionar classe ativa ao link de navegação quando a seção estiver visível
        const sections = $('section');
        const navLinks = $('.nav-links a');

        $(window).on('scroll', function() {
            let current = '';
            
            sections.each(function() {
                const sectionTop = $(this).offset().top;
                const sectionHeight = $(this).outerHeight();
                if ($(window).scrollTop() >= (sectionTop - sectionHeight / 3)) {
                    current = $(this).attr('id');
                }
            });

            navLinks.removeClass('active');
            navLinks.filter('[href="#' + current + '"]').addClass('active');
        });
    },

    async loadDataFromBackend() {
        try {
            // Mostrar loading
            Swal.fire({
                title: 'Carregando...',
                text: 'Por favor, aguarde enquanto carregamos os dados.',
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Tentar carregar dados do About
            const aboutResponse = await Connections.fetchAbout();
            if (aboutResponse.success) {
                window.about = { dados: aboutResponse.data };
                console.log('Dados do About carregados do banco:', window.about.dados);
            } else {
                console.log('Usando dados estáticos do About');
            }

            // Tentar carregar dados do Features
            const featuresResponse = await Connections.fetchFeatures();
            if (featuresResponse.success) {
                window.features = { dados: featuresResponse.data };
                console.log('Dados do Features carregados do banco:', window.features.dados);
            } else {
                console.log('Usando dados estáticos do Features');
            }

            // Tentar carregar dados do Models
            const modelsResponse = await Connections.fetchModels();
            if (modelsResponse.success) {
                window.models = { dados: modelsResponse.data };
                console.log('Dados do Models carregados do banco:', window.models.dados);
            } else {
                console.log('Usando dados estáticos do Models');
            }

            // Tentar carregar dados do Testimonials
            const testimonialsResponse = await Connections.fetchTestimonials();
            if (testimonialsResponse.success) {
                window.testimonials = { dados: testimonialsResponse.data };
                console.log('Dados do Testimonials carregados do banco:', window.testimonials.dados);
            } else {
                console.log('Usando dados estáticos do Testimonials');
            }

            // Fechar loading
            Swal.close();
        } catch (error) {
            console.error('Erro ao carregar dados do backend:', error);
            Swal.fire({
                title: 'Erro!',
                text: 'Erro ao carregar dados do site. Por favor, recarregue a página.',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#d33'
            });
        }
    },

    renderTemplates() {
        // Renderizar Features
        const featuresTemplate = $('#features-template').html();
        const featuresContent = $('#features-content');
        if (featuresTemplate && featuresContent.length && window.features) {
            featuresContent.html(Mustache.render(featuresTemplate, { dados: window.features.dados }));
        }

        // Renderizar About
        const aboutTemplate = $('#about-template').html();
        const aboutContent = $('#about-content');
        if (aboutTemplate && aboutContent.length && window.about) {
            aboutContent.html(Mustache.render(aboutTemplate, { dados: window.about.dados }));
        }

        // Renderizar Testimonials
        const testimonialsTemplate = $('#testimonials-template').html();
        const testimonialsContent = $('#testimonials-content');
        if (testimonialsTemplate && testimonialsContent.length && window.testimonials) {
            testimonialsContent.html(Mustache.render(testimonialsTemplate, { dados: window.testimonials.dados }));
        }

        // Renderizar Models
        const modelsTemplate = $('#models-template').html();
        const modelsContent = $('#models-content');
        if (modelsTemplate && modelsContent.length && window.models) {
            modelsContent.html(Mustache.render(modelsTemplate, { dados: window.models.dados }));
        }
    }
};
