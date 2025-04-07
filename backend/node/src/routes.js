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
        
        await pool.query('UPDATE about SET title = ?, image_url = ?, image_alt = ? WHERE id = 1', 
            [title, image_url, image_alt]);
        
        // Atualizar parágrafos
        for (const paragraph of paragraphs) {
            await pool.query(
                'UPDATE about_paragraphs SET paragraph_text = ? WHERE about_id = 1 AND paragraph_order = ?',
                [paragraph.paragraph_text, paragraph.paragraph_order]
            );
        }

        res.json({ message: 'Sobre atualizado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar sobre', error: error.message });
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
        
        for (const feature of features) {
            await pool.query(
                'UPDATE features SET icon = ?, title = ?, description = ? WHERE display_order = ?',
                [feature.icone, feature.titulo, feature.descricao, feature.display_order]
            );
        }

        res.json({ 
            erro: 0,
            dados: null,
            mensagem: 'Features atualizadas com sucesso' 
        });
    } catch (error) {
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
            preco: model.price,
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
        
        for (const model of models) {
            await pool.query(
                'UPDATE house_models SET name = ?, price = ?, description = ?, is_featured = ? WHERE id = ?',
                [model.nome, model.preco, model.descricao, model.destaque, model.id]
            );

            // Atualizar features do modelo
            for (const feature of model.caracteristicas) {
                await pool.query(
                    'UPDATE house_model_features SET feature_text = ? WHERE model_id = ? AND feature_order = ?',
                    [feature, model.id, model.caracteristicas.indexOf(feature) + 1]
                );
            }
        }

        res.json({ 
            erro: 0,
            dados: null,
            mensagem: 'Modelos atualizados com sucesso' 
        });
    } catch (error) {
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
        
        for (const testimonial of testimonials) {
            await pool.query(
                'UPDATE testimonials SET testimonial_text = ?, client_name = ?, client_location = ?, client_photo_url = ? WHERE display_order = ?',
                [
                    testimonial.depoimento,
                    testimonial.cliente.nome,
                    testimonial.cliente.cidade,
                    testimonial.cliente.foto,
                    testimonial.display_order
                ]
            );
        }

        res.json({ 
            erro: 0,
            dados: null,
            mensagem: 'Depoimentos atualizados com sucesso' 
        });
    } catch (error) {
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