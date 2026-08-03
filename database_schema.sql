-- ==============================================================================
-- CryptoDrop - MySQL Database Schema (Custom Backend API)
-- ==============================================================================
-- As per the updated plan: 
-- This database schema is designed for a custom Next.js Backend API 
-- connected to MySQL on Hostinger for Live Production.
-- ==============================================================================


-- ==============================================================================
-- BLOG TABLES
-- ==============================================================================

-- Authors
CREATE TABLE IF NOT EXISTS authors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    bio TEXT,
    avatar_url VARCHAR(255),
    twitter_handle VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Blog Categories
CREATE TABLE IF NOT EXISTS blog_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    body LONGTEXT NOT NULL,          -- HTML or Markdown content
    cover_image_url VARCHAR(255),
    author_id INT,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    
    -- SEO Fields
    seo_title VARCHAR(255),
    seo_description TEXT,
    focus_keyword VARCHAR(255),
    
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE SET NULL
);

-- Blog Post - Category Mapping (Many-to-Many)
CREATE TABLE IF NOT EXISTS post_category_mapping (
    post_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (post_id, category_id),
    FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE CASCADE
);

-- ==============================================================================
-- ADDITIONAL TABLES (E.g., Automation / Newsletter)
-- ==============================================================================

-- Newsletter Subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    status ENUM('active', 'unsubscribed') DEFAULT 'active',
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Automation Logs (For tracking your python/nodejs automation scripts)
CREATE TABLE IF NOT EXISTS automation_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    script_name VARCHAR(100) NOT NULL,
    status ENUM('success', 'failed', 'running') NOT NULL,
    error_message TEXT,
    run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- INITIAL DATA SEEDING (Optional)
-- ==============================================================================

INSERT IGNORE INTO blog_categories (name, slug, description) VALUES
('Crypto News', 'crypto-news', 'Latest updates from the crypto world'),
('Airdrop Guides', 'airdrop-guides', 'Step by step guides to claim airdrops'),
('Market Analysis', 'market-analysis', 'Insights and trends in the crypto market');

INSERT IGNORE INTO authors (name, slug, bio) VALUES
('Admin User', 'admin-user', 'Lead author and crypto enthusiast at CryptoDrop.');
