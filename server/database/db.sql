/* Reference Schema */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS chat (
id UUID DEFAULT uuid_generate_v4(),
type TEXT,
title TEXT,
timestanp TIMESTAMP DEFAULT NOW(),
PRIMARY KEY (id)
);
CREATE INDEX index_UOnwxi ON chat (id);
CLUSTER chat USING index_UOnwxi;
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
CREATE INDEX index_AuqBPF ON chats (id);
CLUSTER chats USING index_AuqBPF;
CREATE INDEX index_relation_QXdXFa ON chats (billionaireid);
