import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentMonth, getCurrentYear } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    let whereClause = {}
    
    // If month and year are provided, filter by them
    if (month && year) {
      whereClause = {
        month: parseInt(month),
        year: parseInt(year),
      }
    }

    const income = await prisma.income.findMany({
      where: whereClause,
      orderBy: {
        date: 'desc',
      },
    })

    return NextResponse.json(income)
  } catch (error) {
    console.error('Error fetching income:', error)
    return NextResponse.json(
      { error: 'Failed to fetch income' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { source, description, amount, taxDeduction, date, category, remarks, month, year } = body

    const grossAmount = parseFloat(amount)
    const taxAmount = parseFloat(taxDeduction || 0)
    const netAmount = grossAmount - taxAmount

    const income = await prisma.income.create({
      data: {
        source,
        description,
        amount: grossAmount,
        taxDeduction: taxAmount,
        netAmount,
        date: new Date(date),
        category,
        remarks,
        month: month || getCurrentMonth(),
        year: year || getCurrentYear(),
      },
    })

    return NextResponse.json(income, { status: 201 })
  } catch (error) {
    console.error('Error creating income:', error)
    return NextResponse.json(
      { error: 'Failed to create income' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing income id' }, { status: 400 })
    }
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