import { supabase } from './supabaseClient';

export async function uploadFile(file, metadata, bucketName = 'NaderNewBucket') {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${metadata.uploaded_by}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        metadata: {
          ...metadata,
          contentType: file.type,
        },
      });

    if (error) throw error;

    // Create a record in the files table
    const { data: fileRecord, error: dbError } = await supabase
      .from('files')
      .insert([
        {
          file_path: filePath,
          file_name: file.name,
          uploaded_by: metadata.uploaded_by,
          uploaded_for: metadata.uploaded_for,
          file_type: file.type,
          size: file.size,
        },
      ])
      .select()
      .single();

    if (dbError) throw dbError;

    return fileRecord;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export async function getAccessibleFiles(userId, isAdmin) {
  try {
    let query = supabase
      .from('files')
      .select('*');

    if (!isAdmin) {
      query = query.or(`uploaded_by.eq.${userId},uploaded_for.eq.${userId}`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
}

export async function getSignedUrl(filePath, bucketName = 'NaderNewBucket') {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, 60); // URL expires in 60 seconds

    if (error) throw error;
    return data.signedUrl;
  } catch (error) {
    console.error('Error getting signed URL:', error);
    throw error;
  }
}

export async function deleteFile(fileId, filePath, userId, isAdmin, bucketName = 'NaderNewBucket') {
  try {
    // Check permissions
    const { data: file, error: fetchError } = await supabase
      .from('files')
      .select('*')
      .eq('id', fileId)
      .single();

    if (fetchError) throw fetchError;

    if (!isAdmin && file.uploaded_by !== userId) {
      throw new Error('Unauthorized to delete this file');
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (storageError) throw storageError;

    // Delete from database
    const { error: dbError } = await supabase
      .from('files')
      .delete()
      .eq('id', fileId);

    if (dbError) throw dbError;

    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
} 