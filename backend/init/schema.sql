CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        hashed_password TEXT NOT NULL
    );

CREATE TABLE IF NOT EXISTS ArtisanInputs(
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    product_description TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    tone TEXT NOT NULL,
    keywords TEXT,
    additional_info TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS results(
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
);


CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        FOREIGN KEY (id) REFERENCES results (id)
);

CREATE TABLE IF NOT EXISTS email_prompts (
    id INTEGER PRIMARY KEY,
    email_generated TEXT NOT NULL,
    FOREIGN KEY (id) REFERENCES results (id)
);


CREATE TABLE IF NOT EXISTS marketing_prompts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        marketing_content TEXT NOT NULL,
        FOREIGN KEY (id) REFERENCES results (id)
);


-- images 
CREATE TABLE IF NOT EXISTS input_image (
    id INTEGER PRIMARY KEY,
    tag INTEGER, 
    data BLOB,
    FOREIGN KEY (id) REFERENCES results (id)
);
CREATE TABLE IF NOT EXISTS output_image (
    id INTEGER,
    tag INTEGER, 
    data BLOB,
    PRIMARY KEY (id, tag),
    FOREIGN KEY (id) REFERENCES results (id)
);


--videos 
CREATE TABLE IF NOT EXISTS output_videos (
    id INTEGER,
    tag INTEGER, 
    data BLOB,
    PRIMARY KEY (id, tag),
    FOREIGN KEY (id) REFERENCES results (id)
);


--pricing
CREATE TABLE IF NOT EXISTS pricing (
    id INTEGER PRIMARY KEY,
    price INTEGER NOT NULL,
    FOREIGN KEY (id) REFERENCES results (id)
);

--faqs
CREATE TABLE IF NOT EXISTS faqs (
    id INTEGER,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    PRIMARY KEY (id, question),
    FOREIGN KEY (id) REFERENCES results (id)
);


--stories/description 
CREATE TABLE IF NOT EXISTS story (
    id INTEGER PRIMARY KEY,
    story TEXT NOT NULL,
    FOREIGN KEY (id) REFERENCES results (id) 
);

CREATE TABLE IF NOT EXISTS product_history (
    id INTEGER PRIMARY KEY, 
    location_specific_info TEXT NOT NULL,
    descriptive_history TEXT NOT NULL,
    FOREIGN KEY (id) REFERENCES results (id)
);


--processing_metadata

CREATE TABLE IF NOT EXISTS processing_metadata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uid TEXT,
    status TEXT,
    message TEXT,
    error TEXT,
    processing_time REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--

CREATE TABLE IF NOT EXISTS product_title (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    FOREIGN KEY (id) REFERENCES results (id)
);

CREATE TABLE IF NOT EXISTS product_artist (
    id INTEGER PRIMARY KEY,
    artist TEXT NOT NULL,
    FOREIGN KEY (id) REFERENCES results (id)
);

CREATE TABLE IF NOT EXISTS product_style (
    id INTEGER PRIMARY KEY,
    style TEXT NOT NULL,
    FOREIGN KEY (id) REFERENCES results (id)
);

CREATE TABLE IF NOT EXISTS product_origin (
    id INTEGER PRIMARY KEY,
    origin TEXT NOT NULL,
    FOREIGN KEY (id) REFERENCES results (id)
);

CREATE TABLE IF NOT EXISTS product_predicted_artist (
    id INTEGER PRIMARY KEY, 
    predicted_artist TEXT NOT NULL,
    FOREIGN KEY (id) REFERENCES results (id)
);

CREATE TABLE IF NOT EXISTS product_medium (
    id INTEGER PRIMARY KEY,
    medium TEXT NOT NULL,
    FOREIGN KEY (id) REFERENCES results (id)
);

CREATE TABLE IF NOT EXISTS product_themes (
    id INTEGER PRIMARY KEY,
    themes TEXT NOT NULL,
    FOREIGN KEY (id) REFERENCES results (id)
);

CREATE TABLE IF NOT EXISTS product_colors(
    id INTEGER PRIMARY KEY,
    colors TEXT NOT NULL,
    FOREIGN KEY (id) REFERENCES results (id)
);



--social media

CREATE TABLE IF NOT EXISTS youtube_urls (
    uid INTEGER PRIMARY KEY,
    url TEXT NOT NULL,
    title TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES results (id)
);
CREATE TABLE IF NOT EXISTS youtube_thumbnail(
    id INTEGER PRIMARY KEY,
    data BLOB,
    FOREIGN KEY (id) REFERENCES results (id)
);


--edited videos
CREATE TABLE IF NOT EXISTS edited_videos (
    id INTEGER PRIMARY KEY,
    data BLOB,
    FOREIGN KEY (id) REFERENCES results (id)
);


--adbanners

CREATE TABLE IF NOT EXISTS ad_banners (
    id INTEGER,
    tag INTEGER, 
    data BLOB,
    PRIMARY KEY (id, tag),
    FOREIGN KEY (id) REFERENCES results (id)
);


CREATE TABLE IF NOT EXISTS comics (
    id INTEGER PRIMARY KEY,
    data BLOB,
    FOREIGN KEY (id) REFERENCES results (id)

);


CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY,
    art_forms TEXT,
    holidays TEXT,
    items TEXT,
    reasons TEXT,
    style_hints TEXT,
    FOREIGN KEY (id) REFERENCES results (id)
);

CREATE TABLE IF NOT EXISTS generated_email (
    id INTEGER PRIMARY KEY,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (id) REFERENCES results (id)
);

CREATE TABLE IF NOT EXISTS mailing_list (
    id INTEGER PRIMARY KEY,
    email TEXT NOT NULL,
    FOREIGN KEY (id) REFERENCES results (id)
);


-- DROP TABLE IF EXISTS edited_videos;
-- DROP TABLE IF EXISTS youtube_url; 
-- DROP TABLE IF EXISTS edited_videos;