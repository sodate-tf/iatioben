import { addCategoryAction, deleteCategoryAction, getCategoriesAction, updateCategoryAction } from '@/app/adminTioBen/actions/categoryAction';
import { NextResponse } from 'next/server';


export async function GET() {
  const cats = await getCategoriesAction();
  return NextResponse.json(cats);
}

export async function POST(req: Request) {
  const { name } = await req.json();
  const cat = await addCategoryAction(name);
  return NextResponse.json(cat);
}

export async function PUT(req: Request) {
  const { id, name } = await req.json();
  const cat = await updateCategoryAction(id, name);
  return NextResponse.json(cat);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const ok = await deleteCategoryAction(id);
  return NextResponse.json({ ok });
}
