import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const templates = await prisma.billTemplate.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error fetching bill templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bill templates' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, amount, dueDay, category, isActive } = body

    const template = await prisma.billTemplate.create({
      data: {
        name,
        description,
        amount: parseFloat(amount),
        dueDay: parseInt(dueDay),
        category,
        isActive: isActive !== undefined ? isActive : true,
      },
    })

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error('Error creating bill template:', error)
    return NextResponse.json(
      { error: 'Failed to create bill template' },
      { status: 500 }
    )
  }
}
