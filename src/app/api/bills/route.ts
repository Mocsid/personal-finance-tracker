import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentMonth, getCurrentYear } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = parseInt(searchParams.get('month') || getCurrentMonth().toString())
    const year = parseInt(searchParams.get('year') || getCurrentYear().toString())

    const bills = await prisma.bill.findMany({
      where: {
        month,
        year,
      },
      orderBy: {
        dueDate: 'asc',
      },
    })

    return NextResponse.json(bills)
  } catch (error) {
    console.error('Error fetching bills:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bills' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, amount, dueDate, category, remarks, month, year } = body

    const bill = await prisma.bill.create({
      data: {
        name,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        category,
        remarks,
        month: month || getCurrentMonth(),
        year: year || getCurrentYear(),
        status: 'UNPAID',
      },
    })

    return NextResponse.json(bill, { status: 201 })
  } catch (error) {
    console.error('Error creating bill:', error)
    return NextResponse.json(
      { error: 'Failed to create bill' },
      { status: 500 }
    )
  }
}