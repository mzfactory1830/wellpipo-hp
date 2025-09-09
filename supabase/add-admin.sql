-- 管理者ユーザーを追加するSQL
-- Supabase Dashboardで実行してください

-- 管理者として登録するGoogleアカウントのメールアドレスを設定
INSERT INTO admin_users (email, name) VALUES
  ('your-email@gmail.com', 'あなたの名前')
ON CONFLICT (email) DO NOTHING;

-- 複数の管理者を追加する場合
-- INSERT INTO admin_users (email, name) VALUES
--   ('admin1@gmail.com', '管理者1'),
--   ('admin2@gmail.com', '管理者2'),
--   ('admin3@gmail.com', '管理者3')
-- ON CONFLICT (email) DO NOTHING;

-- 登録済みの管理者を確認
SELECT * FROM admin_users;