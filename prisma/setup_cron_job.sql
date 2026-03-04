-- Habilita a extensão pg_cron (Supabase natively supports this)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Cria ou substitui a função plpgsql que fará o processamento
CREATE OR REPLACE FUNCTION process_daily_analytics()
RETURNS void AS $$
BEGIN
  -- 1. Inserir dados agregados de ontem
  INSERT INTO "DailyAnalytics" ("id", "date", "rifaId", "totalViews", "uniqueVisitors", "createdAt", "updatedAt")
  SELECT 
    gen_random_uuid()::text,
    CURRENT_DATE - INTERVAL '1 day',
    "rifaId",
    COUNT(*)::integer,
    COUNT(DISTINCT "sessionId")::integer,
    NOW(),
    NOW()
  FROM "LinkView"
  WHERE "createdAt" >= CURRENT_DATE - INTERVAL '1 day'
    AND "createdAt" < CURRENT_DATE
  GROUP BY "rifaId"
  ON CONFLICT ("date", "rifaId") DO UPDATE 
  SET "totalViews" = EXCLUDED."totalViews",
      "uniqueVisitors" = EXCLUDED."uniqueVisitors",
      "updatedAt" = NOW();

  -- 2. Limpar os dados brutos antigos (retenção de 30 dias)
  DELETE FROM "LinkView"
  WHERE "createdAt" < CURRENT_DATE - INTERVAL '30 days';
  
END;
$$ LANGUAGE plpgsql;

-- Remove o agendamento caso já exista para evitar duplicatas
DO $$
BEGIN
  PERFORM cron.unschedule('daily_analytics_job');
EXCEPTION WHEN OTHERS THEN
  -- ignora erros se o job não existir
END;
$$;

-- Agendar a função para rodar todos os dias às 03:00 da manhã
SELECT cron.schedule('daily_analytics_job', '0 3 * * *', 'SELECT process_daily_analytics();');
