import { redirect } from "next/navigation";

// Redirect bare /read to the scripture reader
export default function ReadPage() {
  redirect("/read/genesis/1");
}
