"use server";
import { NextRequest, NextResponse } from "next/server";

export async function contactSubmit(formData: FormData): Promise<string | null> {
    try {
        console.log('formData', formData);
        return null
    }
    catch (error) {
        console.log('error', error);
        return '/login'
    }
}