-- ============================================================================
-- SUPABASE STORAGE SETUP SCRIPT
-- ============================================================================
-- Run this in your Supabase SQL Editor to fix storage bucket issues
-- ============================================================================

-- First, update the bucket to be public using the correct syntax
-- Update the buckets table directly:
UPDATE storage.buckets
SET public = true
WHERE id = 'admission_documents';

-- ============================================================================
-- RLS POLICIES FOR ADMISSION DOCUMENTS BUCKET
-- ============================================================================

-- Drop existing policies if they exist (optional, to start fresh)
DROP POLICY IF EXISTS "Public Access - Read" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update Own" ON storage.objects;

-- Allow public read access to all files (for viewing/downloading)
CREATE POLICY "Public Access - Read" ON storage.objects
FOR SELECT
USING ( bucket_id = 'admission_documents' );

-- Allow authenticated users to upload documents
CREATE POLICY "Authenticated Upload" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'admission_documents' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their own files
CREATE POLICY "Authenticated Update Own" ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'admission_documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================================================
-- TROUBLESHOOTING: Check storage configuration
-- ============================================================================

-- Check bucket status (run this separately):
-- SELECT id, name, public FROM storage.buckets WHERE name = 'admission_documents';

-- Check existing policies (run this separately):
-- SELECT * FROM storage.policies WHERE bucket_id = 'admission_documents';

-- If bucket doesn't exist, create it (run this separately):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('admission_documents', 'admission_documents', true);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- After running, verify with:
-- SELECT id, name, public FROM storage.buckets WHERE name = 'admission_documents';
-- SELECT policy_name, operation FROM storage.policies WHERE bucket_id = 'admission_documents';

