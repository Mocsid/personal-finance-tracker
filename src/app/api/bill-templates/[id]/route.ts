import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, description, amount, dueDay, category, isActive } = body

    const template = await prisma.billTemplate.update({
      where: { id },
      data: {
        name,
        description,
        amount: parseFloat(amount),
        dueDay: parseInt(dueDay),
        category,
        isActive,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error('Error updating bill template:', error)
    return NextResponse.json(
      { error: 'Failed to update bill template' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await prisma.billTemplate.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting bill template:', error)
    return NextResponse.json(
      { error: 'Failed to delete bill template' },
      { status: 500 }
    )
  }
}
