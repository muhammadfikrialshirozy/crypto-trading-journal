import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

interface Params {
  params: { id: string }
}

// PUT /api/trades/:id - update trade
export async function PUT(request: Request, { params }: Params) {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const { error } = await supabase
    .from('trades')
    .update(body)
    .eq('id', params.id)
    .eq('user_id', user.id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}

// DELETE /api/trades/:id - delete trade
export async function DELETE(request: Request, { params }: Params) {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { error } = await supabase
    .from('trades')
    .delete()
    .eq('id', params.id)
    .eq('user_id', user.id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}