'use server';

import createSupabaseServerClient from './supabase/server';
import { embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function createEmbedding(title: string, body: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { daata: null, error: new Error('User not authenticated') };
  }
  // Function to chunk the body if it's too long
  function chunkText(text: string, chunkSize: number): string[] {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
  }

  const maxChunkSize = 1000; // Define a suitable chunk size
  const bodyChunks = chunkText(body, maxChunkSize);

  const { embeddings } = await embedMany({
    model: openai.embedding('text-embedding-3-small'),
    values: bodyChunks,
  });
  const documents = embeddings.map((embedding, index) => ({
    title,
    body: bodyChunks[index],
    embedding: embedding,
    user_id: user.id,
  }));

  // Store the vector in Postgres
  const { data, error } = await supabase.from('documents').insert(documents);

  return { data, error };
}

export async function generateEmbedding(body: string) {
  const { embeddings } = await embedMany({
    model: openai.embedding('text-embedding-3-small'),
    values: [body],
  });

  return embeddings[0];
}

export async function matchDocuments(
  embedding: Array<number>,
  threshold: number,
  count: number,
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, error: new Error('User not authenticated') };
  }

  return supabase
    .rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: threshold,
      match_count: count,
    })
    .eq('user_id', user.id);
}

export async function getDocuments() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, error: new Error('User not authenticated') };
  }

  return supabase.from('documents').select('*').eq('user_id', user.id);
}