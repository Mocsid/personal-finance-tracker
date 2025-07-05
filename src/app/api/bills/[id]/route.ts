import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, amount, dueDate, status, category, remarks, paidDate, createTemplate, templateData } = body

    const updateData: any = {
      name,
      amount: parseFloat(amount),
      dueDate: new Date(dueDate),
      status,
      category,
      remarks,
      updatedAt: new Date(),
    }

    // Only include paidDate if it's provided and not null
    if (paidDate !== null && paidDate !== undefined) {
      updateData.paidDate = new Date(paidDate)
    } else if (status === 'UNPAID') {
      updateData.paidDate = null
    }

    const bill = await prisma.bill.update({
      where: { id },
      data: updateData,
    })

    // If requested, create or update a recurring template
    let template = null
    if (createTemplate && templateData) {
      // Try to find an existing template for this bill (by name, amount, dueDay, category)
      const existingTemplate = await prisma.billTemplate.findFirst({
        where: {
          name: templateData.name,
          amount: parseFloat(templateData.amount),
          dueDay: parseInt(templateData.dueDay),
          category: templateData.category,
        },
      })
      if (existingTemplate) {
        template = await prisma.billTemplate.update({
          where: { id: existingTemplate.id },
          data: {
            ...templateData,
            amount: parseFloat(templateData.amount),
            dueDay: parseInt(templateData.dueDay),
            isActive: true,
          },
        })
      } else {
        template = await prisma.billTemplate.create({
          data: {
            ...templateData,
            amount: parseFloat(templateData.amount),
            dueDay: parseInt(templateData.dueDay),
            isActive: true,
          },
        })
      }
    }

    return NextResponse.json({ ...bill, template })
  } catch (error) {
    console.error('Error updating bill:', error)
    return NextResponse.json(
      { error: 'Failed to update bill' },
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
    await prisma.bill.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting bill:', error)
    return NextResponse.json(
      { error: 'Failed to delete bill' },
      { status: 500 }
    )
  }
}
