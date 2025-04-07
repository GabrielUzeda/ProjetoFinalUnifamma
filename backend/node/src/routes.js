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
            return res.status(404).json({ message: 'Sobre não encontrado' });
        }

        res.json({
            ...about[0],
            paragraphs: paragraphs
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar informações sobre', error: error.message });
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
        res.json(features);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar features', error: error.message });
    }
});

router.put('/features', async (req, res) => {
    try {
        const features = req.body;
        
        for (const feature of features) {
            await pool.query(
                'UPDATE features SET icon = ?, title = ?, description = ? WHERE display_order = ?',
                [feature.icon, feature.title, feature.description, feature.display_order]
            );
        }

        res.json({ message: 'Features atualizadas com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar features', error: error.message });
    }
});

// Rotas para Models
router.get('/models', async (req, res) => {
    try {
        const [models] = await pool.query('SELECT * FROM house_models');
        const [features] = await pool.query('SELECT * FROM house_model_features ORDER BY model_id, feature_order');
        
        const modelsWithFeatures = models.map(model => ({
            ...model,
            features: features.filter(f => f.model_id === model.id)
        }));

        res.json(modelsWithFeatures);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar modelos', error: error.message });
    }
});

router.put('/models', async (req, res) => {
    try {
        const models = req.body;
        
        for (const model of models) {
            await pool.query(
                'UPDATE house_models SET name = ?, price = ?, description = ?, is_featured = ? WHERE id = ?',
                [model.name, model.price, model.description, model.is_featured, model.id]
            );

            // Atualizar features do modelo
            for (const feature of model.features) {
                await pool.query(
                    'UPDATE house_model_features SET feature_text = ? WHERE model_id = ? AND feature_order = ?',
                    [feature.feature_text, model.id, feature.feature_order]
                );
            }
        }

        res.json({ message: 'Modelos atualizados com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar modelos', error: error.message });
    }
});

// Rotas para Testimonials
router.get('/testimonials', async (req, res) => {
    try {
        const [testimonials] = await pool.query('SELECT * FROM testimonials ORDER BY display_order');
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar depoimentos', error: error.message });
    }
});

router.put('/testimonials', async (req, res) => {
    try {
        const testimonials = req.body;
        
        for (const testimonial of testimonials) {
            await pool.query(
                'UPDATE testimonials SET testimonial_text = ?, client_name = ?, client_location = ?, client_photo_url = ? WHERE display_order = ?',
                [testimonial.testimonial_text, testimonial.client_name, testimonial.client_location, testimonial.client_photo_url, testimonial.display_order]
            );
        }

        res.json({ message: 'Depoimentos atualizados com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar depoimentos', error: error.message });
    }
});

module.exports = router;