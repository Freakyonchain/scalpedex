// app/api/products/[barcode]/route.ts
import { createClient } from '@server/supabase'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET(
  request: Request,
  { params }: { params: { barcode: string } }
) {
  try {
    const supabase = createClientBrowser()
    const { data, error } = await supabase
      .from('products')
      .select('id, name, barcode')
      .eq('barcode', params.barcode)
      .eq('is_active', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found
        return NextResponse.json(null)
      }
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { message: error.message || 'Error fetching product' },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}