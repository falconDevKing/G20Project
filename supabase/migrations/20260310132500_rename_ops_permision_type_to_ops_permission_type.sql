do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'partner'
      and column_name = 'ops_permision_type'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'partner'
      and column_name = 'ops_permission_type'
  ) then
    alter table public.partner rename column ops_permision_type to ops_permission_type;
  end if;
end $$;

do $$
begin
  if exists (
    select 1 from pg_constraint where conname = 'partner_ops_permision_type_check'
  ) then
    alter table public.partner drop constraint partner_ops_permision_type_check;
  end if;

  if exists (
    select 1 from pg_constraint where conname = 'partner_ops_permission_type_check'
  ) then
    alter table public.partner drop constraint partner_ops_permission_type_check;
  end if;

  alter table public.partner
    add constraint partner_ops_permission_type_check
    check (ops_permission_type in ('hos', 'governor', 'president') or ops_permission_type is null);
end $$;
