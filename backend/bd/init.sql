-- init.sql

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS tecnolar_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tecnolar_db;

-- Set default charset for the database
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET character_set_connection=utf8mb4;
SET character_set_client=utf8mb4;
SET character_set_results=utf8mb4;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- About section table
CREATE TABLE IF NOT EXISTS about (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    image_alt VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- About paragraphs table
CREATE TABLE IF NOT EXISTS about_paragraphs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    about_id INT NOT NULL,
    paragraph_text TEXT NOT NULL,
    paragraph_order INT NOT NULL,
    FOREIGN KEY (about_id) REFERENCES about(id) ON DELETE CASCADE,
    UNIQUE KEY unique_paragraph_order (about_id, paragraph_order)
);

-- Features table
CREATE TABLE IF NOT EXISTS features (
    id INT AUTO_INCREMENT PRIMARY KEY,
    icon VARCHAR(10) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    display_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_feature_order (display_order)
);

-- House models table
CREATE TABLE IF NOT EXISTS house_models (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- House model features table
CREATE TABLE IF NOT EXISTS house_model_features (
    id INT AUTO_INCREMENT PRIMARY KEY,
    model_id INT NOT NULL,
    feature_text VARCHAR(255) NOT NULL,
    feature_order INT NOT NULL,
    FOREIGN KEY (model_id) REFERENCES house_models(id) ON DELETE CASCADE,
    UNIQUE KEY unique_model_feature_order (model_id, feature_order)
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    testimonial_text TEXT NOT NULL,
    client_name VARCHAR(100) NOT NULL,
    client_location VARCHAR(100) NOT NULL,
    client_photo_url VARCHAR(255) NOT NULL,
    display_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_testimonial_order (display_order)
);

-- Insert demo user (password: Admin@123)
INSERT INTO users (username, password, email, full_name, role)
VALUES ('admin', '$2y$10$uG5mh3hKvVg9B.A3d9QYb.ZV6bY5O2w5q1AQ2AGRjkVwJjIRXMhJi', 'admin@tecnolar.com', 'Administrador Sistema', 'admin');

-- Insert about data
INSERT INTO about (id, title, image_url, image_alt)
VALUES (1, 'Sobre a TecnoLar Construções', 'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80', 'Fábrica TecnoLar');

-- Insert about paragraphs
INSERT INTO about_paragraphs (about_id, paragraph_text, paragraph_order) VALUES
(1, 'A TecnoLar Construções nasceu da visão de revolucionar o mercado da construção civil, trazendo inovação, agilidade e sustentabilidade através do sistema construtivo pré-moldado.', 1),
(1, 'Fundada há mais de 15 anos, nossa empresa já entregou mais de 1.000 casas em todo o Brasil, consolidando-se como referência em tecnologia construtiva de alta qualidade.', 2),
(1, 'Contamos com uma equipe de engenheiros, arquitetos e técnicos especializados em construções pré-moldadas, que utilizam as mais avançadas tecnologias e processos para garantir a excelência em cada projeto.', 3),
(1, 'Nossa fábrica possui 5.000m² de área construída, onde produzimos peças de concreto e outros componentes com precisão milimétrica, garantindo o encaixe perfeito e a resistência superior de nossas construções.', 4);

-- Insert features
INSERT INTO features (icon, title, description, display_order) VALUES
('⏱️', 'Construção Rápida', 'Entrega em até 60% menos tempo que uma construção convencional, permitindo que você realize o sonho da casa própria rapidamente.', 1),
('💰', 'Economia', 'Redução de até 30% no custo total da obra, com menor desperdício de materiais e mão de obra otimizada.', 2),
('🌱', 'Sustentabilidade', 'Processo construtivo com menor impacto ambiental, menos resíduos e possibilidade de utilização de materiais ecológicos.', 3),
('🔍', 'Qualidade Controlada', 'Peças produzidas em ambiente controlado, garantindo maior precisão, resistência e durabilidade para sua casa.', 4),
('🏠', 'Personalização', 'Projetos personalizados que atendem às suas necessidades, com flexibilidade para adaptações e acabamentos exclusivos.', 5),
('🛡️', 'Garantia Estendida', 'Nossas construções possuem garantia de 10 anos na estrutura, proporcionando segurança e tranquilidade para sua família.', 6);

-- Insert house models
INSERT INTO house_models (name, price, description, is_featured) VALUES
('Modelo Compact', 79900.00, 'Casa compacta e funcional, ideal para casais ou pequenas famílias', FALSE),
('Modelo Comfort', 129900.00, 'O equilíbrio perfeito entre espaço, conforto e custo-benefício', TRUE),
('Modelo Premium', 199900.00, 'Para quem busca mais espaço e sofisticação em cada detalhe', FALSE);

-- Insert house model features
-- Compact
INSERT INTO house_model_features (model_id, feature_text, feature_order) VALUES
(1, '45m² de área construída', 1),
(1, '2 quartos', 2),
(1, '1 banheiro', 3),
(1, 'Sala e cozinha integradas', 4),
(1, 'Área de serviço', 5),
(1, 'Prazo de entrega: 30 dias', 6);

-- Comfort
INSERT INTO house_model_features (model_id, feature_text, feature_order) VALUES
(2, '75m² de área construída', 1),
(2, '3 quartos (1 suíte)', 2),
(2, '2 banheiros', 3),
(2, 'Sala de estar e jantar', 4),
(2, 'Cozinha americana', 5),
(2, 'Varanda gourmet', 6),
(2, 'Prazo de entrega: 45 dias', 7);

-- Premium
INSERT INTO house_model_features (model_id, feature_text, feature_order) VALUES
(3, '110m² de área construída', 1),
(3, '3 suítes', 2),
(3, 'Escritório', 3),
(3, 'Sala ampla com pé direito duplo', 4),
(3, 'Cozinha gourmet', 5),
(3, 'Área de lazer', 6),
(3, 'Prazo de entrega: 60 dias', 7);

-- Insert testimonials
INSERT INTO testimonials (testimonial_text, client_name, client_location, client_photo_url, display_order) VALUES
('Fiquei impressionado com a velocidade da construção. Em apenas 45 dias, minha casa estava pronta para morar, com acabamento impecável e qualidade superior ao que imaginava.', 'Roberto Almeida', 'Belo Horizonte/MG', 'https://randomuser.me/api/portraits/men/44.jpg', 1),
('A economia foi real! Economizei quase 25% comparado aos orçamentos de construção convencional que recebi. E o melhor: sem perder qualidade ou acabamento.', 'Fernanda Santos', 'Campinas/SP', 'https://randomuser.me/api/portraits/women/65.jpg', 2),
('O atendimento pós-venda da TecnoLar é excepcional. Mesmo depois de 3 anos, quando precisei fazer uma adaptação, eles me atenderam rapidamente e resolveram tudo.', 'Carlos Eduardo', 'Curitiba/PR', 'https://randomuser.me/api/portraits/men/32.jpg', 3);
