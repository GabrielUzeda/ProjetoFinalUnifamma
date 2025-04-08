const express = require('express');
const router = express.Router();
const pool = require('./database/config');

// Rota principal da API
router.get('/', (req, res) => {
    res.status(200).json({
        message: 'API em funcionamento',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            about: '/api/about',
            features: '/api/features',
            models: '/api/models',
            testimonials: '/api/testimonials'
        }
    });
});

// Rota de saúde
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Rotas para About
router.get('/about', async (req, res) => {
    try {
        const [about] = await pool.query('SELECT * FROM about LIMIT 1');
        const [paragraphs] = await pool.query('SELECT * FROM about_paragraphs ORDER BY paragraph_order');
        
        if (!about[0]) {
            return res.status(404).json({ 
                erro: 1,
                dados: null,
                mensagem: 'Sobre não encontrado' 
            });
        }

        const paragrafos = paragraphs.map(p => p.paragraph_text);

        res.json({
            erro: 0,
            dados: {
                titulo: about[0].title,
                paragrafos: paragrafos,
                imagem: {
                    url: about[0].image_url,
                    alt: about[0].image_alt
                }
            },
            mensagem: 'Dados sobre a empresa carregados com sucesso'
        });
    } catch (error) {
        res.status(500).json({ 
            erro: 1,
            dados: null,
            mensagem: 'Erro ao buscar informações sobre: ' + error.message 
        });
    }
});

router.put('/about', async (req, res) => {
    try {
        const { title, image_url, image_alt, paragraphs } = req.body;
        console.log('Recebendo dados do about:', { title, image_url, image_alt, paragraphs });
        
        // Primeiro, limpar dados existentes
        await pool.query('DELETE FROM about_paragraphs');
        console.log('Parágrafos limpos');
        
        // Inserir ou atualizar dados do about
        const [result] = await pool.query(
            'INSERT INTO about (id, title, image_url, image_alt) VALUES (1, ?, ?, ?) ON DUPLICATE KEY UPDATE title = ?, image_url = ?, image_alt = ?',
            [title, image_url, image_alt, title, image_url, image_alt]
        );
        console.log('About principal inserido/atualizado');
        
        // Inserir parágrafos
        for (const [index, paragraph] of paragraphs.entries()) {
            await pool.query(
                'INSERT INTO about_paragraphs (about_id, paragraph_text, paragraph_order) VALUES (1, ?, ?)',
                [paragraph, index + 1]
            );
        }
        console.log('Parágrafos inseridos');

        res.json({ 
            erro: 0,
            dados: null,
            mensagem: 'Sobre atualizado com sucesso' 
        });
    } catch (error) {
        console.error('Erro ao atualizar sobre:', error);
        res.status(500).json({ 
            erro: 1,
            dados: null,
            mensagem: 'Erro ao atualizar sobre: ' + error.message 
        });
    }
});

// Rotas para Features
router.get('/features', async (req, res) => {
    try {
        const [features] = await pool.query('SELECT * FROM features ORDER BY display_order');
        
        const dados = features.map(feature => ({
            icone: feature.icon,
            titulo: feature.title,
            descricao: feature.description
        }));

        const response = {
            erro: 0,
            dados: JSON.parse(JSON.stringify(dados)),
            mensagem: 'Vantagens carregadas com sucesso'
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ 
            erro: 1,
            dados: null,
            mensagem: 'Erro ao buscar features: ' + error.message 
        });
    }
});

router.put('/features', async (req, res) => {
    try {
        const features = req.body;
        
        // Limpar features existentes
        await pool.query('DELETE FROM features');
        
        // Inserir novas features
        for (const [index, feature] of features.entries()) {
            await pool.query(
                'INSERT INTO features (icon, title, description, display_order) VALUES (?, ?, ?, ?)',
                [feature.icone, feature.titulo, feature.descricao, index + 1]
            );
        }

        res.json({ 
            erro: 0,
            dados: null,
            mensagem: 'Features atualizadas com sucesso' 
        });
    } catch (error) {
        console.error('Erro ao atualizar features:', error);
        res.status(500).json({ 
            erro: 1,
            dados: null,
            mensagem: 'Erro ao atualizar features: ' + error.message 
        });
    }
});

// Rotas para Models
router.get('/models', async (req, res) => {
    try {
        const [models] = await pool.query('SELECT * FROM house_models');
        const [features] = await pool.query('SELECT * FROM house_model_features ORDER BY model_id, feature_order');
        
        const dados = models.map(model => ({
            nome: model.name,
            preco: Number(model.price).toLocaleString('pt-BR', { 
                style: 'currency', 
                currency: 'BRL',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }),
            descricao: model.description,
            caracteristicas: features
                .filter(f => f.model_id === model.id)
                .map(f => f.feature_text),
            destaque: model.is_featured
        }));

        const response = {
            erro: 0,
            dados: JSON.parse(JSON.stringify(dados)),
            mensagem: 'Modelos carregados com sucesso'
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ 
            erro: 1,
            dados: null,
            mensagem: 'Erro ao buscar modelos: ' + error.message 
        });
    }
});

router.put('/models', async (req, res) => {
    try {
        const models = req.body;
        console.log('Recebendo dados dos modelos:', models);
        
        // Primeiro, limpar todas as características existentes
        await pool.query('DELETE FROM house_model_features');
        console.log('Características limpas');
        
        // Atualizar cada modelo
        for (const [index, model] of models.entries()) {
            console.log('Processando modelo:', model);
            
            // Atualizar ou inserir o modelo
            const price = model.preco.replace('R$ ', '').replace('.', '').replace(',', '.');
            console.log('Preço convertido:', price);
            
            await pool.query(
                'INSERT INTO house_models (id, name, price, description, is_featured) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = ?, price = ?, description = ?, is_featured = ?',
                [
                    index + 1,
                    model.nome,
                    price,
                    model.descricao,
                    model.destaque,
                    model.nome,
                    price,
                    model.descricao,
                    model.destaque
                ]
            );
            console.log('Modelo inserido/atualizado');

            // Inserir as características do modelo
            for (const [featureIndex, feature] of model.caracteristicas.entries()) {
                await pool.query(
                    'INSERT INTO house_model_features (model_id, feature_text, feature_order) VALUES (?, ?, ?)',
                    [index + 1, feature, featureIndex + 1]
                );
            }
            console.log('Características inseridas');
        }

        res.json({ 
            erro: 0,
            dados: null,
            mensagem: 'Modelos atualizados com sucesso' 
        });
    } catch (error) {
        console.error('Erro ao atualizar modelos:', error);
        res.status(500).json({ 
            erro: 1,
            dados: null,
            mensagem: 'Erro ao atualizar modelos: ' + error.message 
        });
    }
});

// Rotas para Testimonials
router.get('/testimonials', async (req, res) => {
    try {
        const [testimonials] = await pool.query('SELECT * FROM testimonials ORDER BY display_order');
        
        const dados = testimonials.map(testimonial => ({
            depoimento: testimonial.testimonial_text,
            cliente: {
                foto: testimonial.client_photo_url,
                nome: testimonial.client_name,
                cidade: testimonial.client_location
            }
        }));

        // Garantir que os dados sejam retornados como um array limpo
        const response = {
            erro: 0,
            dados: JSON.parse(JSON.stringify(dados)), // Isso remove os índices numéricos
            mensagem: 'Depoimentos carregados com sucesso'
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ 
            erro: 1,
            dados: null,
            mensagem: 'Erro ao buscar depoimentos: ' + error.message 
        });
    }
});

router.put('/testimonials', async (req, res) => {
    try {
        const testimonials = req.body;
        
        // Primeiro, limpar todos os depoimentos existentes
        await pool.query('DELETE FROM testimonials');
        
        // Inserir os novos depoimentos
        for (const [index, testimonial] of testimonials.entries()) {
            await pool.query(
                'INSERT INTO testimonials (testimonial_text, client_name, client_location, client_photo_url, display_order) VALUES (?, ?, ?, ?, ?)',
                [
                    testimonial.depoimento,
                    testimonial.cliente.nome,
                    testimonial.cliente.cidade,
                    testimonial.cliente.foto,
                    index + 1
                ]
            );
        }

        res.json({ 
            erro: 0,
            dados: null,
            mensagem: 'Depoimentos atualizados com sucesso' 
        });
    } catch (error) {
        console.error('Erro ao atualizar depoimentos:', error);
        res.status(500).json({ 
            erro: 1,
            dados: null,
            mensagem: 'Erro ao atualizar depoimentos: ' + error.message 
        });
    }
});

// Rota para o formulário de contato
router.post('/contact', async (req, res) => {
    try {
        const { name, email, phone, modelo, message } = req.body;

        // Validação dos campos obrigatórios
        if (!name || !email || !phone || !modelo) {
            return res.status(400).json({
                erro: 1,
                dados: null,
                mensagem: 'Os campos nome, e-mail, telefone e modelo são obrigatórios'
            });
        }

        // Inserir no banco de dados
        const [result] = await pool.query(
            'INSERT INTO contact_submissions (name, email, phone, modelo, message) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone, modelo, message || null]
        );

        res.json({
            erro: 0,
            dados: {
                id: result.insertId,
                name,
                email,
                phone,
                modelo,
                message: message || ''
            },
            mensagem: 'Mensagem enviada com sucesso! Entraremos em contato em breve.'
        });
    } catch (error) {
        console.error('Erro ao processar formulário de contato:', error);
        res.status(500).json({
            erro: 1,
            dados: null,
            mensagem: 'Erro ao processar sua mensagem. Por favor, tente novamente mais tarde.'
        });
    }
});

module.exports = router;