/* Reference Schema */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS chat (
id UUID DEFAULT uuid_generate_v4(),
type TEXT,
timestanp TIMESTAMP DEFAULT NOW(),
PRIMARY KEY (id)
);
CREATE INDEX index_Q0mTgx ON chat (id);
CLUSTER chat USING index_Q0mTgx;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS chats (
id UUID DEFAULT uuid_generate_v4(),
input TEXT,
output TEXT,
timestanp TIMESTAMP DEFAULT NOW(),
billionaireid UUID,
PRIMARY KEY (id),
FOREIGN KEY (billionaireid) REFERENCES chat(id) ON DELETE CASCADE 
);
CREATE INDEX index_4wvMlN ON chats (id);
CLUSTER chats USING index_4wvMlN;
CREATE INDEX index_relation_RPmg0p ON chats (billionaireid);
