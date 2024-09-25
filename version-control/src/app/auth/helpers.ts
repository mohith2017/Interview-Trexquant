"use server";
import { auth, signIn as naSignIn, signOut as naSignOut } from ".";
export async function signIn() {
  await naSignIn();

}

export async function signOut() {
  await naSignOut();

}
