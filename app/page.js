import Link from "next/link"


export default function Home() {
  return (
    <div className="flex justify-center flex-col gap-2 items-center h-screen">
      <h1 className="text-2xl font-bold">Design-ul il vom face curând ;)</h1>
      <Link href="/admin">
        <button className=" cursor-pointer hover:bg-green-900 hover:scale-110 active:scale-90 rounded-md px-5 py-3 bg-green-800 text-white">Admin :)</button>
      </Link>
    </div>
  )
}
