export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export type GalleryCategory = 'handball' | 'Physical' | 'football' | 'basketball' | 'sports' | 'movies' | 'other';

export interface Gallery {
  id: string;
  user_id: string;
  name: string;
  description: string;
  visibility: 'public' | 'private' | 'authenticated';
  is_private?: boolean;
  category: GalleryCategory;
  created_at: string;
  updated_at: string;
}

export interface Video {
  user_id?: string;
  id: string;
  gallery_id: string;
  title: string;
  description: string;
  youtube_id: string;
  tags: { [key: string]: string[] };
  created_at: string;
  updated_at: string;
}

export interface TagGroup {
  id: string;
  gallery_id: string;
  name: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export type Tables = {
  profiles: Profile;
  galleries: Gallery;
  videos: Video;
  tag_groups: TagGroup;
};