-- Seed local: usuários administradores e planos padrão do Conecta Mais.
-- Executado automaticamente pelo `supabase start` / `supabase db reset`.

insert into public.users (id, name, email, password, role, role_name, phone, avatar, active, permissions)
values
  (
    'usr-1',
    'Jandson',
    'jandson@conectamais.com.br',
    'conecta123',
    'admin',
    'Sócio Diretor (Acesso Total)',
    '(11) 98111-2233',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    true,
    '["dashboard","kanban","leads","screens","plans","finance","partner-sellers","calendar","access","reports","seller-dashboard","seller-sales","seller-hotleads","seller-commissions","create-leads","edit-leads","delete-leads","create-finance","edit-finance","delete-finance","create-users","edit-users","delete-users"]'::jsonb
  ),
  (
    'usr-teste-admin',
    'Admin Teste',
    'teste@teste.com',
    '123456',
    'admin',
    'Administrador (Ambiente Local)',
    '',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    true,
    '["dashboard","kanban","leads","screens","plans","finance","partner-sellers","calendar","access","reports","seller-dashboard","seller-sales","seller-hotleads","seller-commissions","create-leads","edit-leads","delete-leads","create-finance","edit-finance","delete-finance","create-users","edit-users","delete-users"]'::jsonb
  )
on conflict (id) do nothing;

insert into public.plans (id, name, badge, tvs, monthly_price, quarterly_price, fixed_price, period_days, changes_per_month, is_popular, is_campaign, color, tagline, description)
values
  ('plan-presenca', 'Plano Presença', '⭐', 1, 99.90, 250.00, null, null, 1, false, false, '#00b4d8', 'Presença essencial para pequenos negócios', '1 TV • 1 alteração de anúncio por mês • R$ 99,90/mês ou R$ 250,00 trimestral'),
  ('plan-destaque', 'Plano Destaque', '🔥', 2, 149.90, 390.00, null, null, 1, false, false, '#0077b6', 'Dupla visibilidade e maior repetição', '2 TVs • 1 alteração de anúncio por mês • R$ 149,90/mês ou R$ 390,00 trimestral'),
  ('plan-alcance', 'Plano Alcance', '🚀', 3, 199.90, 520.00, null, null, 1, false, false, '#2563eb', 'Expansão em múltiplos pontos de alto tráfego', '3 TVs • 1 alteração de anúncio por mês • R$ 199,90/mês ou R$ 520,00 trimestral'),
  ('plan-impacto', 'Plano Impacto', '💥', 4, 249.90, 650.00, null, null, 1, false, false, '#f59e0b', 'Forte presença e alto poder de conversão', '4 TVs • 1 alteração de anúncio por mês • R$ 249,90/mês ou R$ 650,00 trimestral'),
  ('plan-conecta', 'Plano Conecta', '👑', 5, 299.90, 780.00, null, null, 2, true, false, '#fbbf24', '5 TVs da rede • Maior alcance e 2 trocas mensais', '5 TVs da nossa rede • 2 alterações de anúncio/mês • Maior alcance na rede • R$ 299,90/mês ou R$ 780,00 trimestral'),
  ('plan-avulso-15', 'Avulso — 15 Dias', '🎯', 5, null, null, 79.90, 15, 0, false, true, '#10b981', 'Promoção, inauguração, evento ou data comemorativa', 'Campanha de 15 dias sem fidelidade nas 5 TVs • R$ 79,90'),
  ('plan-avulso-30', 'Avulso — 30 Dias', '🎯', 5, null, null, 129.90, 30, 1, false, true, '#10b981', 'Divulgação intensiva por 30 dias', 'Campanha de 30 dias sem fidelidade nas 5 TVs • 1 alteração • R$ 129,90'),
  ('plan-custom', 'Personalizado', '⚙️', 1, 150.00, null, null, null, 1, false, false, null, null, 'Valores ou condições customizadas')
on conflict (id) do nothing;
