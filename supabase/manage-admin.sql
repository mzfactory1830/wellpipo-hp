-- 管理者権限を管理するSQL
-- Supabase DashboardのSQL Editorで実行してください

-- 全ユーザーを確認（メールアドレス付き）
SELECT 
  au.*, 
  u.email,
  u.raw_user_meta_data->>'full_name' as name
FROM admin_users au
JOIN auth.users u ON au.user_id = u.id
ORDER BY au.created_at DESC;

-- 特定のユーザーに管理者権限を付与（メールアドレスで検索）
UPDATE admin_users 
SET is_admin = true, updated_at = NOW()
WHERE user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'your-email@gmail.com'
  LIMIT 1
);

-- 特定のユーザーから管理者権限を削除（メールアドレスで検索）
-- UPDATE admin_users 
-- SET is_admin = false, updated_at = NOW()
-- WHERE user_id = (
--   SELECT id FROM auth.users 
--   WHERE email = 'user-email@gmail.com'
--   LIMIT 1
-- );

-- 管理者権限を持つユーザーのみ表示
-- SELECT 
--   au.*, 
--   u.email,
--   u.raw_user_meta_data->>'full_name' as name
-- FROM admin_users au
-- JOIN auth.users u ON au.user_id = u.id
-- WHERE au.is_admin = true;