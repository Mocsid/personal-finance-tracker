import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { source, description, amount, taxDeduction, date, category, remarks, month, year } = body

    const grossAmount = parseFloat(amount)
    const taxAmount = parseFloat(taxDeduction || 0)
    const netAmount = grossAmount - taxAmount

    const income = await prisma.income.update({
      where: { id },
      data: {
        source,
        description,
        amount: grossAmount,
        taxDeduction: taxAmount,
        netAmount,
        date: new Date(date),
        category,
        remarks,
        month: month || new Date(date).getMonth() + 1,
        year: year || new Date(date).getFullYear(),
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(income)
  } catch (error) {
    console.error('Error updating income:', error)
    return NextResponse.json(
      { error: 'Failed to update income' },
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
    await prisma.income.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting income:', error)
    return NextResponse.json(
      { error: 'Failed to delete income' },
      { status: 500 }
    )
  }
}
