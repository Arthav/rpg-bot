-- DROP TABLE IF EXISTS players, guilds, inventory, items, quests, player_quests, battles, enemies, transactions, daily_rewards CASCADE;

CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE,
    race VARCHAR(20) NOT NULL,
    class VARCHAR(20) NOT NULL,
    level INT DEFAULT 1,
    experience INT DEFAULT 0,
    health INT DEFAULT 100,
    max_health INT DEFAULT 100,
    mana INT DEFAULT 50,
    max_mana INT DEFAULT 50,
    attack INT DEFAULT 10,
    defense INT DEFAULT 5,
    speed INT DEFAULT 5,
    gold INT DEFAULT 0,
    -- guild_id will be added later
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE guilds (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    -- leader_id will be added later
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add the foreign key to guild_id in players table
ALTER TABLE players
ADD COLUMN guild_id INT REFERENCES guilds(id) ON DELETE SET NULL;

-- Add the foreign key to leader_id in guilds table
ALTER TABLE guilds
ADD COLUMN leader_id INT REFERENCES players(id) ON DELETE SET NULL;



CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    type VARCHAR(20) CHECK (type IN ('weapon', 'armor', 'potion', 'misc')),
    attack_bonus INT DEFAULT 0,
    defense_bonus INT DEFAULT 0,
    healing INT DEFAULT 0,
    price INT DEFAULT 0
);

CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    player_id INT REFERENCES players(id) ON DELETE CASCADE,
    item_id INT REFERENCES items(id) ON DELETE CASCADE,
    quantity INT DEFAULT 1,
    UNIQUE (player_id, item_id)
);

CREATE TABLE quests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    required_level INT DEFAULT 1,
    reward_gold INT DEFAULT 0,
    reward_xp INT DEFAULT 0,
    reward_item_id INT REFERENCES items(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE player_quests (
    id SERIAL PRIMARY KEY,
    player_id INT REFERENCES players(id) ON DELETE CASCADE,
    quest_id INT REFERENCES quests(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE enemies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    health INT NOT NULL,
    attack INT NOT NULL,
    defense INT NOT NULL,
    experience_reward INT DEFAULT 10,
    gold_reward INT DEFAULT 5
);

CREATE TABLE battles (
    id SERIAL PRIMARY KEY,
    player_id INT REFERENCES players(id) ON DELETE CASCADE,
    enemy_id INT REFERENCES enemies(id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('ongoing', 'won', 'lost')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    player_id INT REFERENCES players(id) ON DELETE CASCADE,
    item_id INT REFERENCES items(id) ON DELETE SET NULL,
    quantity INT DEFAULT 1,
    transaction_type VARCHAR(20) CHECK (transaction_type IN ('purchase', 'trade')),
    target_player_id INT REFERENCES players(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE VIEW leaderboard AS
SELECT 
    username, 
    level, 
    experience 
FROM 
    players 
ORDER BY 
    level DESC, experience DESC;

CREATE TABLE daily_rewards (
    id SERIAL PRIMARY KEY,
    player_id INT REFERENCES players(id) ON DELETE CASCADE,
    claimed_at DATE DEFAULT CURRENT_DATE,
    UNIQUE (player_id, claimed_at)
);


-- Relationships and Explanation
-- players and guilds: A player can join a guild, but if the guild is deleted, their membership is set to NULL.
-- inventory: Tracks items owned by players with a unique constraint to avoid duplicate entries for the same item.
-- player_quests: Tracks quest progress, allowing players to revisit old quests and manage status.
-- battles: Stores the outcome of player-enemy interactions.
-- transactions: Keeps a history of item exchanges and trades for auditing and gameplay balance.
