-- Enable RLS (Row Level Security)
alter table profiles enable row level security;
alter table videos enable row level security;
alter table tag_groups enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Videos policies
create policy "Public videos are viewable by everyone"
  on videos for select
  using (is_public = true);

create policy "Users can view all videos when authenticated"
  on videos for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can insert videos"
  on videos for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own videos"
  on videos for update
  using (auth.uid() = user_id);

create policy "Users can delete own videos"
  on videos for delete
  using (auth.uid() = user_id);

-- Tag groups policies
create policy "Tag groups are viewable by everyone"
  on tag_groups for select
  using (true);

create policy "Authenticated users can insert tag groups"
  on tag_groups for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own tag groups"
  on tag_groups for update
  using (auth.uid() = user_id);

create policy "Users can delete own tag groups"
  on tag_groups for delete
  using (auth.uid() = user_id);

-- Drop unused table
drop table if exists tag_groups2;