import { pool } from './db';

async function ensureTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS facts (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      entity TEXT NOT NULL,
      attr TEXT NOT NULL,
      value TEXT NOT NULL,
      lang VARCHAR(8) DEFAULT 'en',
      tags JSON NULL,
      UNIQUE KEY uniq_fact ((MD5(CONCAT(entity,'::',attr,'::',IFNULL(lang,'')))))
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS events (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      title TEXT NOT NULL,
      datetime DATETIME NOT NULL,
      venue TEXT NULL,
      description_en TEXT NULL,
      description_it TEXT NULL,
      tags JSON NULL,
      UNIQUE KEY uniq_event ((MD5(CONCAT(title,'::',datetime))))
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}



export type Fact = { entity:string; attr:string; value:string; lang?:string; tags?:string[] }
export type EventItem = { title:string; datetime:string; venue?:string; description_en?:string; description_it?:string; tags?:string[] }

export async function readKnowledge(){
    await ensureTables();
  const [facts]: any = await pool.query('SELECT entity, attr, value, lang, tags FROM facts ORDER BY id DESC LIMIT 200');
  const [events]: any = await pool.query('SELECT title, datetime, venue, description_en, description_it, tags FROM events ORDER BY datetime ASC LIMIT 200');
  return { facts, events };
}

export async function upsertFacts(items: Fact[]){
  await ensureTables();
  if(!items?.length) return await readKnowledge();
  const conn = await pool.getConnection();
  try{
    await conn.beginTransaction();
    for(const f of items){
      await conn.query(
        `INSERT INTO facts (entity, attr, value, lang, tags)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE value=VALUES(value), tags=VALUES(tags)`,
        [f.entity, f.attr, f.value, f.lang || 'en', f.tags ? JSON.stringify(f.tags) : null]
      );
    }
    await conn.commit();
  }catch(e){ await conn.rollback(); throw e } finally{ conn.release() }
  return await readKnowledge();
}

export async function addEvents(items: EventItem[]){
    await ensureTables();
  if(!items?.length) return await readKnowledge();
  const conn = await pool.getConnection();
  try{
    await conn.beginTransaction();
    for(const e of items){
      await conn.query(
        `INSERT INTO events (title, datetime, venue, description_en, description_it, tags)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE venue=VALUES(venue), description_en=VALUES(description_en),
                                 description_it=VALUES(description_it), tags=VALUES(tags)`,
        [e.title, e.datetime, e.venue || null, e.description_en || null, e.description_it || null, e.tags ? JSON.stringify(e.tags) : null]
      );
    }
    await conn.commit();
  }catch(e){ await conn.rollback(); throw e } finally{ conn.release() }
  return await readKnowledge();
}
