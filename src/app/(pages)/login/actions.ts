'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'

/**
 * ログイン
 *
 * ログインが成功した場合は、プロフィールが存在すればトップページへ、
 * 存在しなければプロフィール作成ページへリダイレクトする。
 * ログインに失敗した場合はエラーページへリダイレクトする。
 *
 * @param formData - フォームから受け取ったデータ
 * @returns void
 */
export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error, data: authData } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  // ユーザーのプロフィールが存在するか確認
  if (authData.user) {
    const dbUser = await prisma.user.findUnique({
      where: { email: authData.user.email },
    })

    // プロフィールが存在しない場合はプロフィール作成ページへ
    if (!dbUser) {
      revalidatePath('/profile', 'page')
      redirect('/profile')
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

/**
 * サインアップ
 *
 * サインアップが成功した場合はプロフィール作成ページへリダイレクトする。
 * サインアップに失敗した場合はエラーページへリダイレクトする。
 *
 * @param formData - フォームから受け取ったデータ
 * @returns void
 */
export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/profile', 'page')
  redirect('/profile')
}

/**
 * サインアウト
 *
 * サインアウトが成功した場合はログインページへリダイレクトする。
 * サインアウトに失敗した場合はエラーページへリダイレクトする。
 *
 * @returns void
 */
export async function signout() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    redirect('/error')
  }

  redirect('/login')
}