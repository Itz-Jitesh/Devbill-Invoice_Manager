import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { verifyAuth } from '@/lib/auth';

/**
 * GET /api/clients
 * Fetch all clients belonging to the authenticated user.
 */
export async function GET(request) {
  try {
    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', auth.user._id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    // Map `id` to `_id` and `user_id` to `userId` for frontend compatibility if needed
    const normalizedClients = clients.map(client => ({
      ...client,
      _id: client.id,
      userId: client.user_id
    }));

    return NextResponse.json(normalizedClients);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch clients: ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/clients
 * Create a new client for the authenticated user.
 */
export async function POST(request) {
  try {
    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    
    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Prepare client data for Supabase
    const clientData = {
      name: body.name,
      email: body.email,
      company: body.company,
      user_id: auth.user._id,
      is_active: true
    };

    const { data: client, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Normalize for frontend
    const normalizedClient = {
      ...client,
      _id: client.id,
      userId: client.user_id
    };

    return NextResponse.json(normalizedClient, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create client: ' + error.message },
      { status: 500 }
    );
  }
}
