import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-[17px] pb-12 pt-[17px] text-center">
      <h1 className="page-title">404 Not Found</h1>
      <p className="mt-6 text-[14px]">
        The page you were looking for does not exist. <Link href="/" className="underline">Continue shopping</Link>
      </p>
    </div>
  );
}
