// app/api/products/route.ts
import { createClientBrowser } from '@/lib/supabase/client'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const supabase = createClientBrowser()
    const { name, barcode, category = 'card', is_active = true } = await req.json()

    if (!name || !barcode) {
      return NextResponse.json(
        { message: 'Name and barcode are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name,
          barcode,
          category,
          is_active,
        }
      ])
      .select('id, name, barcode')
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { message: error.message || 'Error creating product' },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}